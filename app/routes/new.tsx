import { redirect } from "remix";
import type { LoaderFunction } from "remix";

import { db } from "~/db.server";

export let loader: LoaderFunction = async ({ params }) => {
  const board = await db.board.create({
    data: {},
  });

  return redirect(`/board/${board.id}`);
};
