import type { Prisma } from "@prisma/client";

export type Comment = Prisma.CommentGetPayload<{
  include: {
    childrens: true;
  };
}>;

export type User = {
  email: string;
  name: string;
  picture: string;
};
