import { json } from "remix";
import invariant from "tiny-invariant";
import type { ActionFunction } from "remix";

import { db } from "~/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  console.log({ request });
  invariant(params.boardId, "Expected params.boardId");

  if (request.method === "POST") {
    const form = await request.formData();
    const text = form.get("comment");
    const type = form.get("type");

    if (typeof text !== "string" || typeof type !== "string") {
      throw new Error(`Form not submitted correctly.`);
    }

    await db.comment.create({
      data: { text, type, boardId: params.boardId },
    });

    return json({ clearForm: true });
  }

  if (request.method === "PUT") {
    const form = await request.formData();
    const commentId = form.get("commentId");
    const likes = form.get("likes");

    if (typeof likes !== "string" || typeof commentId !== "string") {
      throw new Error(`Form not submitted correctly.`);
    }

    await db.comment.update({
      where: {
        id: commentId,
      },
      data: { likes: +likes },
    });

    return json({ voted: true });
  }
};
