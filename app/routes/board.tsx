import { Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import Layout from "~/components/Layout";
import { User } from "~/types";

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const data: LoaderData = {
    user,
  };

  return json(data);
};

export default function Board() {
  const { user } = useLoaderData<LoaderData>();
  return (
    <Layout user={user}>
      <Outlet />
    </Layout>
  );
}
