import type { Prisma } from "@prisma/client";

export type Comment = Prisma.CommentGetPayload<{
  include: {
    childrens: true;
  };
}>;
