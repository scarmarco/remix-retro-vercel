import type { LoaderFunction } from "@remix-run/node";
import { Comment } from "@prisma/client";
import invariant from "tiny-invariant";
import { events } from "~/services/board.server";
import { eventType } from "~/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.boardId, "Expected params.boardId");
  if (!request.signal) return new Response(null, { status: 500 });

  return new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        const handleNewComment = (boardId: string, comment: Comment) => {
          if (boardId === params.boardId) {
            controller.enqueue(
              encoder.encode(`event: ${eventType.NEW_COMMENT}\n`)
            );
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(comment)}\n\n`)
            );
          }
        };

        const handleGroupComment = (
          boardId: string,
          comment: Comment,
          childrenId: string
        ) => {
          if (boardId === params.boardId) {
            controller.enqueue(
              encoder.encode(`event: ${eventType.GROUP_COMMENT}\n`)
            );
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ comment, childrenId })}\n\n`
              )
            );
          }
        };

        const handleUngroupComment = (
          boardId: string,
          comment: Comment,
          childrenId: string
        ) => {
          if (boardId === params.boardId) {
            controller.enqueue(
              encoder.encode(`event: ${eventType.UNGROUP_COMMENT}\n`)
            );
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ comment, childrenId })}\n\n`
              )
            );
          }
        };

        const handleLikeComment = (boardId: string, comment: Comment) => {
          if (boardId === params.boardId) {
            controller.enqueue(
              encoder.encode(`event: ${eventType.LIKE_COMMENT}\n`)
            );
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(comment)}\n\n`)
            );
          }
        };

        const handleChangeStage = (boardId: string, stage: string) => {
          if (boardId === params.boardId) {
            controller.enqueue(
              encoder.encode(`event: ${eventType.CHANGE_STAGE}\n`)
            );
            controller.enqueue(encoder.encode(`data: ${stage}\n\n`));
          }
        };

        let closed = false;
        const close = () => {
          if (closed) return;
          closed = true;

          events.removeListener(eventType.NEW_COMMENT, handleNewComment);
          events.removeListener(eventType.GROUP_COMMENT, handleGroupComment);
          events.removeListener(
            eventType.UNGROUP_COMMENT,
            handleUngroupComment
          );
          events.removeListener(eventType.LIKE_COMMENT, handleLikeComment);
          events.removeListener(eventType.CHANGE_STAGE, handleChangeStage);

          request.signal.removeEventListener("abort", close);
          controller.close();
        };

        events.addListener(eventType.NEW_COMMENT, handleNewComment);
        events.addListener(eventType.GROUP_COMMENT, handleGroupComment);
        events.addListener(eventType.UNGROUP_COMMENT, handleUngroupComment);
        events.addListener(eventType.LIKE_COMMENT, handleLikeComment);
        events.addListener(eventType.CHANGE_STAGE, handleChangeStage);
        request.signal.addEventListener("abort", close);

        if (request.signal.aborted) {
          close();
          return;
        }
      },
    }),
    { headers: { "Content-Type": "text/event-stream" } }
  );
};
