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

  const data: LoaderData = {
    boards: await db.board.findMany({
      select: { id: true },
      where: { owner: user.email },
    }),
  };

  return json(data);
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Link
        to="/new"
        className="bg-white hover:ring ring-black text-black text-center py-2 px-4 rounded-lg border transition"
      >
        Start new retro
      </Link>

      <h2 className="text-xl mx-2">Existing Boards</h2>
      <ul>
        {data.boards.map((board) => (
          <li className="mx-2" key={board.id}>
            <Link to={"/board/" + board.id}>{board.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
