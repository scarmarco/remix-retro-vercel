import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Stage } from "@prisma/client";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type { Board, Stage as StageKey } from "@prisma/client";

import { Comment } from "~/types";
import Card from "~/components/Card";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";
import { changeStage } from "~/services/board.server";
import StagesBar from "~/components/Stages";
import { getCurrentStage } from "~/utils";
import { useBoardEvents } from "~/hooks";

const Stages = Object.keys(Stage) as StageKey[];

export type Payload = {
  board: Board;
  commentsByType: ReturnType<typeof filterItems>;
  owner: string;
};

const sortByLikes = (items: Comment[]) =>
  items.sort((a, b) => b.likes - a.likes);

const filterItems = (items: Comment[]) =>
  items.reduce(
    (itemsObj: Record<string, Comment[]>, item) => ({
      ...itemsObj,
      [item.type]: [...(itemsObj[item.type] || []), item],
    }),
    {}
  );

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const board = await db.board.findUnique({
    where: { id: params.boardId },
    include: {
      items: {
        include: {
          childrens: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!board) throw new Error("Board not found");

  const { items, ...plainBoard } = board;

  if (board.stage === "ACTIONS") {
    const commentsByType = filterItems(sortByLikes(items));

    return json({
      board: plainBoard,
      commentsByType,
      owner: user.email,
    });
  }

  const commentsByType = filterItems(items);

  return json({
    board: plainBoard,
    commentsByType,
    owner: user.email,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.boardId, "Expected params.boardId");

  if (request.method === "PUT") {
    const form = await request.formData();
    const currentStage = form.get("currentStage") as StageKey;

    const currentStageIdx = Stages.indexOf(currentStage);
    const nextStage = Stages[currentStageIdx + 1] ?? Stages[Stages.length - 1];

    const board = await db.board.update({
      where: { id: params.boardId },
      data: { stage: nextStage },
    });

    changeStage(nextStage);

    return json({ board });
  }
};

export default function BoardRoute() {
  const loaderData = useLoaderData<Payload>();

  const { board, commentsByType } = useBoardEvents(loaderData);

  const { isBrainstorming, isAction, isDone } = getCurrentStage(board.stage);

  const columns = useMemo(
    () => [
      {
        placeholder: "It worked",
        type: "worked",
        inputDisabled: !isBrainstorming,
        disabled: isDone,
      },
      {
        placeholder: "To improve",
        type: "improve",
        inputDisabled: !isBrainstorming,
        disabled: isDone,
      },
      {
        placeholder: "To ask",
        type: "ask",
        inputDisabled: !isBrainstorming,
        disabled: isDone,
      },
      {
        placeholder: "To do",
        type: "action",
        disabled: !isAction || isDone,
        hideLikes: true,
      },
    ],
    [board]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col">
        <StagesBar
          board={board}
          isOwner={loaderData.owner === board.userEmail}
        />
        <div className="flex-1 min-h-0 bg-gray-300 flex p-3 gap-3">
          {columns.map((column) => (
            <div key={column.type} className="flex-1 min-w-0">
              <Card
                board={board}
                items={commentsByType[column.type]}
                owner={loaderData.owner}
                {...column}
              />
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
