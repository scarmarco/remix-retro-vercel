import { LoaderFunction, redirect } from "@remix-run/node";
import { SocialsProvider } from "remix-auth-socials";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};
