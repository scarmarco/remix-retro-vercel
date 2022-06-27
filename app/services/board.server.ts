import { EventEmitter } from "node:events";
import { Comment } from "@prisma/client";
import { eventType } from "~/utils";

declare global {
  var boardEvents: Record<string, EventEmitter>;
}

global.boardEvents = global.boardEvents || {};

export const events = boardEvents;

export function newComment(boardId: string, comment: Comment) {
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
