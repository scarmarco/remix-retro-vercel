import { EventEmitter } from "node:events";
import { Comment } from "@prisma/client";
import { eventType } from "~/utils";

declare global {
  var boardEvents: Record<string, EventEmitter>;
}

global.boardEvents = global.boardEvents || {};

export const events = global.boardEvents;

export function initializeBoardEmitter(boardId: string) {
  if (!global.boardEvents[boardId]) {
    console.log("new");
    console.log(global.boardEvents);
    global.boardEvents[boardId] = new EventEmitter();
  }
}

export function newComment(boardId: string, comment: Comment) {
  console.log(global.boardEvents[boardId]);
  boardEvents[boardId].emit(eventType.NEW_COMMENT, comment);
}

export function groupComment(
  boardId: string,
  comment: Comment,
  childrenId: string
) {
  boardEvents[boardId].emit(eventType.GROUP_COMMENT, comment, childrenId);
}

export function ungroupComment(
  boardId: string,
  comment: Comment,
  childrenId: string
) {
  boardEvents[boardId].emit(eventType.UNGROUP_COMMENT, comment, childrenId);
}

export function likeComment(boardId: string, comment: Comment) {
  boardEvents[boardId].emit(eventType.LIKE_COMMENT, comment);
}

export function changeStage(boardId: string, stage: string) {
  boardEvents[boardId].emit(eventType.CHANGE_STAGE, stage);
}
