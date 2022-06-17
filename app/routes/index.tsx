import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";

type LoaderData = {
  boards: { id: string }[];
};

export let loader: LoaderFunction = async ({ request }) => {
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
    };

    return json(data);
  } catch (error) {
    return json({ boards: [] });
  }
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="h-full flex justify-between px-8 py-6">
      <div>
        {!!data.boards.length && (
          <h2 className="text-xl mb-2">Existing Boards:</h2>
        )}
        <ul className="flex flex-col gap-2">
          {data.boards.map((board) => (
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
  );
}
