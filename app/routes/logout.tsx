import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return await authenticator.logout(request, { redirectTo: "/login" });
};
