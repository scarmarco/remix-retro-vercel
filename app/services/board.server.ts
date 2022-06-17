import { EventEmitter } from "node:events";
import { Comment } from "@prisma/client";
import { eventType } from "~/utils";

declare global {
  var boardEvents: EventEmitter;
}

global.boardEvents = global.boardEvents || new EventEmitter();

export const events = boardEvents;

export function newComment(comment: Comment) {
  boardEvents.emit(eventType.NEW_COMMENT, comment);
}

export function groupComment(comment: Comment, childrenId: string) {
  boardEvents.emit(eventType.GROUP_COMMENT, comment, childrenId);
}

export function ungroupComment(comment: Comment, childrenId: string) {
  boardEvents.emit(eventType.UNGROUP_COMMENT, comment, childrenId);
}

export function likeComment(comment: Comment) {
  boardEvents.emit(eventType.LIKE_COMMENT, comment);
}

export function changeStage(stage: string) {
  boardEvents.emit(eventType.CHANGE_STAGE, stage);
}
