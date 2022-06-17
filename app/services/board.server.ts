import { EventEmitter } from "node:events";
import { Comment } from "@prisma/client";

declare global {
  var boardEvents: EventEmitter;
}

global.boardEvents = global.boardEvents || new EventEmitter();

export const events = boardEvents;

export function newComment(comment: Comment) {
  boardEvents.emit("new-comment", { comment });
}
