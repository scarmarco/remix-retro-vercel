import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  return user;
};
