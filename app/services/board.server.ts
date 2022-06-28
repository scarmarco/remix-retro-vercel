import { EventEmitter } from "events";
import { Comment } from "@prisma/client";
import { eventType } from "~/utils";

declare global {
  var boardEvents: EventEmitter;
}

global.boardEvents = global.boardEvents || new EventEmitter();

export const events = global.boardEvents;

export function newComment(boardId: string, comment: Comment) {
  boardEvents.emit(eventType.NEW_COMMENT, boardId, comment);
}

export function groupComment(
  boardId: string,
  comment: Comment,
  childrenId: string
) {
  boardEvents.emit(eventType.GROUP_COMMENT, boardId, comment, childrenId);
}

export function ungroupComment(
  boardId: string,
  comment: Comment,
  childrenId: string
) {
  boardEvents.emit(eventType.UNGROUP_COMMENT, boardId, comment, childrenId);
}

export function likeComment(boardId: string, comment: Comment) {
  boardEvents.emit(eventType.LIKE_COMMENT, boardId, comment);
}

export function changeStage(boardId: string, stage: string) {
  boardEvents.emit(eventType.CHANGE_STAGE, boardId, stage);
}
