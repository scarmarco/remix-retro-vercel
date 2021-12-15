import { Link } from "remix";

export default function IndexRoute() {
  return (
    <div className="h-full flex justify-center items-center">
      <Link
        to="/new"
        className="bg-white hover:bg-gray-200 text-black text-center py-2 px-4 rounded-lg border"
      >
        Start new retro
      </Link>
    </div>
  );
}
