import { Stage } from "@prisma/client";

export function getCurrentStage(stage: Stage) {
  return {
    isBrainstorming: stage === Stage.BRAINSTORMING,
    isVoting: stage === Stage.VOTE,
    isAction: stage === Stage.ACTIONS,
    isDone: stage === Stage.DONE,
  };
}

export const eventType = {
  NEW_COMMENT: "new-comment",
  GROUP_COMMENT: "group-comment",
  UNGROUP_COMMENT: "ungroup-comment",
  LIKE_COMMENT: "like-comment",
  CHANGE_STAGE: "change-stage",
};
