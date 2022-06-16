import { EventEmitter } from "events";

declare global {
  var boardEvents: EventEmitter;
}

global.boardEvents = global.boardEvents || new EventEmitter();

export const events = boardEvents;

export function sendMessage(user: string, message: string) {
  boardEvents.emit("message", { user, message });
}
