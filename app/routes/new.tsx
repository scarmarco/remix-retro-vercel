import { LoaderFunction, redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  try {
    const board = await db.board.create({
      data: {
        userEmail: user.email,
      },
    });
    return redirect(`/board/${board.id}`);
  } catch (error) {
    console.error(error);
    return await authenticator.logout(request, { redirectTo: "/login" });
  }
};
