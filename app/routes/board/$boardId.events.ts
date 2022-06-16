import type { LoaderFunction } from "@remix-run/node";
import { events } from "~/services/board.server";

export const loader: LoaderFunction = async ({ request }) => {
  if (!request.signal) return new Response(null, { status: 500 });
  // const user = await getSessionUser(request)

  return new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        // const handleComment = ({ user, message }: ChatMessage) => {
        //   console.log("message", { user, message });
        //   controller.enqueue(encoder.encode("event: message\n"));
        //   controller.enqueue(
        //     encoder.encode(`data: ${JSON.stringify({ user, message })}\n\n`)
        //   );
        // };

        const handleComment = (user: { text: string; type: string }) => {
          console.log("new comment", { user });
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ user })}\n\n`)
          );
        };

        // const handleUserLeft = (user: string) => {
        //   console.log("user left", { user });
        //   controller.enqueue(encoder.encode("event: user-left\n"));
        //   controller.enqueue(encoder.encode(`data: ${user}\n\n`));
        // };

        let closed = false;
        const close = () => {
          if (closed) return;
          closed = true;

          events.removeListener("message", handleComment);
          // chat.removeListener("user-joined", handleUserJoined);
          // chat.removeListener("user-left", handleUserLeft);
          request.signal.removeEventListener("abort", close);
          controller.close();

          // removeUser(user);
        };

        events.addListener("message", handleComment);
        // chat.addListener("user-joined", handleUserJoined);
        // chat.addListener("user-left", handleUserLeft);
        request.signal.addEventListener("abort", close);

        if (request.signal.aborted) {
          close();
          return;
        }

        // if (!doesUserExist(user)) {
        //   addUser(user);
        //   console.log("users", getUsers());
        // }
      },
    }),
    { headers: { "Content-Type": "text/event-stream" } }
  );
};
