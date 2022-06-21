import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";
import Layout from "~/components/Layout";
import { User } from "~/types";

type LoaderData = {
  boards: { id: string }[];
  user: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  try {
    const boards = await db.board.findMany({
      select: { id: true },
      where: { owner: user },
    });

    const data: LoaderData = {
      boards,
      user,
    };

    return json(data);
  } catch (error) {
    return json({ boards: [], user });
  }
};

export default function IndexRoute() {
  const { boards, user } = useLoaderData<LoaderData>();

  return (
    <Layout user={user}>
      <div className="h-full flex justify-between px-8 py-6">
        <div>
          {!!boards.length && (
            <h2 className="text-xl mb-2">Existing Boards:</h2>
          )}
          <ul className="flex flex-col gap-2">
            {boards.map((board) => (
              <li key={board.id}>
                <Link to={`/board/${board.id}`}>{board.id}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Link
            to="/new"
            className="bg-white hover:ring ring-black text-black text-center py-2 px-4 rounded-lg border transition"
          >
            Start new retro
          </Link>
        </div>
      </div>
    </Layout>
  );
}
