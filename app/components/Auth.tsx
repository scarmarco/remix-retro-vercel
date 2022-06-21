import { useMemo } from "react";
import { Form, Link } from "@remix-run/react";
import cls from "classnames";
import { User } from "~/types";
import Dropdown from "~/components/Dropdown";

type Props = {
  user: User;
};

export default function Auth({ user }: Props) {
  const items = useMemo(
    () => [
      (active: boolean) => (
        <div
          className={cls(
            " block w-full text-left px-4 py-2 text-sm text-gray-700 border-b",
            {
              "bg-gray-100 text-gray-900": active,
            }
          )}
        >
          <b>Signed in as:</b> <br />
          {user.name}
        </div>
      ),
      (active: boolean) => (
        <Link
          to="/"
          className={cls(
            " block w-full text-left px-4 py-2 text-sm text-gray-700 ",
            {
              "bg-gray-100 text-gray-900": active,
            }
          )}
        >
          Dashboard
        </Link>
      ),
      (active: boolean) => (
        <Form action="/logout" method="post" replace>
          <button
            className={cls(
              "block w-full text-left px-4 py-2 text-sm text-gray-700",
              {
                "bg-gray-100 text-gray-900": active,
              }
            )}
            type="submit"
          >
            Logout
          </button>
        </Form>
      ),
    ],
    [user]
  );

  return (
    <div>
      <Dropdown items={items}>
        <img
          src={user.picture}
          width="42"
          height="42"
          alt="profile picture"
          className="rounded-full hover:ring-1 ring-black transition"
        />
      </Dropdown>
    </div>
  );
}
