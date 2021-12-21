import { useLoaderData } from "remix";
import invariant from "tiny-invariant";
import type { LoaderFunction, ActionFunction } from "remix";
import type { Board, Comment } from "@prisma/client";

import Card from "~/components/Card";
import { db } from "~/db.server";

type BoardWithItems = Board & {
  items: Comment[];
};

type LoaderData = { board: BoardWithItems };

export let loader: LoaderFunction = async ({ params }) => {
  const board = await db.board.findUnique({
    where: { id: params.boardId },
    include: {
      items: true,
    },
  });

  if (!board) throw new Error("Board not found");

  const data: LoaderData = { board };
  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.boardId, "Expected params.boardId");
  const form = await request.formData();
  const text = form.get("comment");
  const type = form.get("type");

  if (typeof text !== "string" || typeof type !== "string") {
    throw new Error(`Form not submitted correctly.`);
  }

  const comment = await db.comment.create({
    data: { text, type, boardId: params.boardId },
  });

  return comment;
};

export default function BoardRoute() {
  const { board } = useLoaderData<LoaderData>();

  return (
    <div className="h-full bg-gray-300 flex p-3 gap-3">
      <div className="flex-1">
        <Card placeholder="It worked" type="worked" items={board.items} />
      </div>
      <div className="flex-1">
        <Card placeholder="To improve" type="improve" />
      </div>
      <div className="flex-1">
        <Card placeholder="To ask" type="ask" />
      </div>
      <div className="flex-1">
        <Card placeholder="To do" type="action" />
      </div>
    </div>
  );
}
