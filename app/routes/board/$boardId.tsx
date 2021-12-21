import { useLoaderData, json } from "remix";
import invariant from "tiny-invariant";
import { useMemo } from "react";
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

  await db.comment.create({
    data: { text, type, boardId: params.boardId },
  });

  return json({ ok: true });
};

const filterItems = (items: Comment[]) =>
  items.reduce(
    (itemsObj: Record<string, Comment[]>, item) => ({
      ...itemsObj,
      [item.type]: [...(itemsObj[item.type] || []), item],
    }),
    {}
  );

const columns = [
  { placeholder: "It worked", type: "worked" },
  { placeholder: "To improve", type: "improve" },
  { placeholder: "To ask", type: "ask" },
  { placeholder: "To do", type: "action" },
];

export default function BoardRoute() {
  const { board } = useLoaderData<LoaderData>();

  const filteredItems = useMemo(() => filterItems(board.items), [board]);

  return (
    <div className="h-full bg-gray-300 flex p-3 gap-3">
      {columns.map(({ placeholder, type }) => (
        <div key={type} className="flex-1">
          <Card
            placeholder={placeholder}
            type={type}
            items={filteredItems[type]}
          />
        </div>
      ))}
    </div>
  );
}
