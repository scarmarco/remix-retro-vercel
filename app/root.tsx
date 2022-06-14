import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";

import styles from "./tailwind.css";
import Auth from "./components/Auth";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Retro tool",
  viewport: "width=device-width,initial-scale=1",
});

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 flex-none px-4 py-2 shadow flex justify-between items-center font-semibold text-xl text-gray-900">
        <Link to="/">Hive Remix Retrotool</Link>
        <Auth />
      </header>
      <main className="flex-1 min-h-0">{children}</main>
      <footer className="h-12 flex-none px-4 py-2 shadow flex justify-center items-center font-semibold border border-gray-100">
        Typeform
      </footer>
    </div>
  );
}
