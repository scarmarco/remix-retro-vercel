import { useLoaderData, json } from "remix";
import invariant from "tiny-invariant";
import { useMemo } from "react";
import { Stage } from "@prisma/client";
import type { LoaderFunction, ActionFunction } from "remix";
import type { Comment, Stage as StageKey } from "@prisma/client";

import Card from "~/components/Card";
import { db } from "~/db.server";
import StagesBar from "~/components/Stages";
import { getCurrentStage } from "~/utils";
import type { BoardLoader, BoardWithItems } from "~/types";

const Stages = Object.keys(Stage) as StageKey[];

export const loader: LoaderFunction = async ({ params }) => {
  const board = await db.board.findUnique({
    where: { id: params.boardId },
  });

  const comments = await db.comment.findMany({
    where: { boardId: params.boardId },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!board) throw new Error("Board not found");

  const data: BoardLoader = { board: { ...board, items: comments } };
  return json(data);
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.boardId, "Expected params.boardId");

  if (request.method === "POST") {
    const form = await request.formData();
    const text = form.get("comment");
    const type = form.get("type");

    if (typeof text !== "string" || typeof type !== "string") {
      throw new Error(`Form not submitted correctly.`);
    }

    await db.comment.create({
      data: { text, type, boardId: params.boardId },
    });

    return json({ ok: true });
  }

  if (request.method === "PUT") {
    const form = await request.formData();
    const currentStage = form.get("currentStage") as StageKey;

    const currentStageIdx = Stages.indexOf(currentStage);
    const nextStage = Stages[currentStageIdx + 1] ?? Stages[Stages.length - 1];

    const board = await db.board.update({
      where: { id: params.boardId },
      data: { stage: nextStage },
    });

    return json({ board });
  }
};

const filterItems = (items: Comment[]) =>
  items.reduce(
    (itemsObj: Record<string, Comment[]>, item) => ({
      ...itemsObj,
      [item.type]: [...(itemsObj[item.type] || []), item],
    }),
    {}
  );

export default function BoardRoute() {
  const { board } = useLoaderData<BoardLoader>();
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

  const filteredItems = useMemo(
    () => filterItems((board as BoardWithItems).items),
    [board]
  );

  return (
    <div className="h-full flex flex-col">
      <StagesBar board={board} />
      <div className="flex-1 bg-gray-300 flex p-3 gap-3">
        {columns.map((column) => (
          <div key={column.type} className="flex-1 min-w-0">
            <Card
              board={board}
              items={filteredItems[column.type]}
              {...column}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
