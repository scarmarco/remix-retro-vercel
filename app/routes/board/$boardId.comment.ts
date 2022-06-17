import { ActionFunction, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";
import {
  newComment,
  groupComment,
  ungroupComment,
  likeComment,
} from "~/services/board.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.boardId, "Expected params.boardId");
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (request.method === "POST") {
    const form = await request.formData();
    const text = form.get("comment");
    const type = form.get("type");

    if (typeof text !== "string" || typeof type !== "string") {
      throw new Error(`Form not submitted correctly.`);
    }

    const comment = await db.comment.create({
      data: { text, type, boardId: params.boardId, userEmail: user.email },
      include: { childrens: true },
    });

    newComment(comment);

    return json({ clearForm: true });
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
      const comment = await db.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
        include: { childrens: true },
      });

      likeComment(comment);

      return json({ voted: true });
    }

    if (typeof childCommentId === "string") {
      if (type === "group") {
        const comment = await db.comment.update({
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
          include: {
            childrens: true,
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

        groupComment(comment, childCommentId);

        return json({ grouped: true });
      }

      if (type === "ungroup") {
        const comment = await db.comment.update({
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
          include: {
            childrens: true,
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

        ungroupComment(comment, childCommentId);

        return json({ ungrouped: true });
      }
    }
  }
};
