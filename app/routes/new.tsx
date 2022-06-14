import { redirect } from "remix";
import type { LoaderFunction } from "remix";

import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, { failureRedirect: "/login" })
  const board = await db.board.create({
    data: {
      owner: user.email
    },
  });

  return redirect(`/board/${board.id}`);
};
