import { Form, useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export default function Auth() {
  const user = useFetcher();

  useEffect(() => {
    if (user.type === "init") {
      user.load("/auth/user");
    }
  }, [user]);

  return (
    <div className="text-base">
      {user.type !== "done" && "Loading"}
      {user.type === "done" && user.data?.email && (
        <div className="flex flex-row">
          <div className="mx-2 flex flex-col justify-center">
            {user.data.email}
          </div>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="bg-white hover:ring ring-black text-black text-center py-2 px-4 rounded-lg border transition"
            >
              Logout
            </button>
          </form>
        </div>
      )}
      {user.type === "done" && !user.data && (
        <Form
          className="h-full flex justify-center items-center"
          action="/auth/google"
          method="post"
        >
          <button className="bg-white hover:ring ring-black text-black text-center py-2 px-4 rounded-lg border transition">
            Login
          </button>
        </Form>
      )}
    </div>
  );
}
