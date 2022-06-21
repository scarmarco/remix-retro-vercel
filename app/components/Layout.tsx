import { ReactNode } from "react";
import { Link } from "@remix-run/react";
import Auth from "~/components/Auth";
import { User } from "~/types";

type Props = { children: ReactNode; user?: User; hideLogin?: boolean };

export default function Layout({ children, user, hideLogin = false }: Props) {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 flex-none px-4 py-2 shadow flex justify-between items-center">
        <div className="text-xl text-gray-900 font-semibold">
          <Link to="/">Hive Remix Retrotool</Link>
        </div>
        <div>{!hideLogin && user && <Auth user={user} />}</div>
      </header>
      <main className="flex-1 min-h-0">{children}</main>
      <footer className="h-12 flex-none px-4 py-2 shadow flex justify-center items-center font-semibold border border-gray-100">
        Typeform
      </footer>
    </div>
  );
}
