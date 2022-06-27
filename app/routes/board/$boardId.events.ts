import type { LoaderFunction } from "@remix-run/node";
import { Comment } from "@prisma/client";
import invariant from "tiny-invariant";
import { EventEmitter } from "node:events";
import { events } from "~/services/board.server";
import { eventType } from "~/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.boardId, "Expected params.boardId");
  if (!request.signal) return new Response(null, { status: 500 });

  const { boardId } = params;

  return new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        const handleNewComment = (comment: Comment) => {
          controller.enqueue(
            encoder.encode(`event: ${eventType.NEW_COMMENT}\n`)
          );
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(comment)}\n\n`)
          );
        };

        const handleGroupComment = (comment: Comment, childrenId: string) => {
          controller.enqueue(
            encoder.encode(`event: ${eventType.GROUP_COMMENT}\n`)
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ comment, childrenId })}\n\n`
            )
          );
        };

        const handleUngroupComment = (comment: Comment, childrenId: string) => {
          controller.enqueue(
            encoder.encode(`event: ${eventType.UNGROUP_COMMENT}\n`)
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ comment, childrenId })}\n\n`
            )
          );
        };

        const handleLikeComment = (comment: Comment) => {
          controller.enqueue(
            encoder.encode(`event: ${eventType.LIKE_COMMENT}\n`)
          );
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(comment)}\n\n`)
          );
        };

        const handleChangeStage = (stage: string) => {
          controller.enqueue(
            encoder.encode(`event: ${eventType.CHANGE_STAGE}\n`)
          );
          controller.enqueue(encoder.encode(`data: ${stage}\n\n`));
        };

        let closed = false;
        const close = () => {
          if (closed) return;
          closed = true;

          events[boardId].removeListener(
            eventType.NEW_COMMENT,
            handleNewComment
          );
          events[boardId].removeListener(
            eventType.GROUP_COMMENT,
            handleGroupComment
          );
          events[boardId].removeListener(
            eventType.UNGROUP_COMMENT,
            handleUngroupComment
          );
          events[boardId].removeListener(
            eventType.LIKE_COMMENT,
            handleLikeComment
          );
          events[boardId].removeListener(
            eventType.CHANGE_STAGE,
            handleChangeStage
          );

          if (events[boardId].listenerCount(eventType.NEW_COMMENT) === 0) {
            delete events[boardId];
          }

          request.signal.removeEventListener("abort", close);
          controller.close();
        };

        if (!events[boardId]) {
          events[boardId] = new EventEmitter();
        }

        events[boardId].addListener(eventType.NEW_COMMENT, handleNewComment);
        events[boardId].addListener(
          eventType.GROUP_COMMENT,
          handleGroupComment
        );
        events[boardId].addListener(
          eventType.UNGROUP_COMMENT,
          handleUngroupComment
        );
        events[boardId].addListener(eventType.LIKE_COMMENT, handleLikeComment);
        events[boardId].addListener(eventType.CHANGE_STAGE, handleChangeStage);
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
