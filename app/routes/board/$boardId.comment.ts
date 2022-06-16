import { ActionFunction, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/db.server";
import { sendMessage } from "~/services/board.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.boardId, "Expected params.boardId");

  if (request.method === "POST") {
    console.log("comment POST");
    const form = await request.formData();
    const text = form.get("comment");
    const type = form.get("type");

    if (typeof text !== "string" || typeof type !== "string") {
      throw new Error(`Form not submitted correctly.`);
    }

    await db.comment.create({
      data: { text, type, boardId: params.boardId },
    });

    sendMessage(text, type);

    return null;
  }

  if (request.method === "PUT") {
    const form = await request.formData();
    const commentId = form.get("commentId");
    const type = form.get("type");
    const childCommentId = form.get("childId");

    if (typeof type !== "string" || typeof commentId !== "string") {
      throw new Error(`Form not submitted correctly.`);
    }

    if (type === "vote") {
      await db.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      return json({ voted: true });
    }

    if (typeof childCommentId === "string") {
      if (type === "group") {
        await db.comment.update({
          where: {
            id: commentId,
          },
          data: {
            childrens: {
              connect: {
                id: childCommentId,
              },
            },
          },
        });

        await db.board.update({
          where: {
            id: params.boardId,
          },
          data: {
            items: {
              disconnect: { id: childCommentId },
            },
          },
        });

        return json({ grouped: true });
      }

      if (type === "ungroup") {
        await db.comment.update({
          where: {
            id: commentId,
          },
          data: {
            childrens: {
              disconnect: {
                id: childCommentId,
              },
            },
          },
        });

        await db.board.update({
          where: {
            id: params.boardId,
          },
          data: {
            items: {
              connect: { id: childCommentId },
            },
          },
        });

        return json({ ungrouped: true });
      }
    }
  }
};
