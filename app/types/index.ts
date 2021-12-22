import type { Board, Comment } from "@prisma/client";

export type BoardWithItems = Board & {
  items: Comment[];
};

export type BoardLoader = { board: BoardWithItems | Board };
