import { Link } from "@remix-run/react";

export default function IndexRoute() {
  return (
    <div className="h-full flex justify-center items-center">
      <Link
        to="/new"
        className="bg-white hover:ring ring-black text-black text-center py-2 px-4 rounded-lg border transition"
      >
        Start new retro
      </Link>
    </div>
  );
}
