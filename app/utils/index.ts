import { Stage } from "@prisma/client";

export function getCurrentStage(stage: Stage) {
  return {
    isBrainstorming: stage === Stage.BRAINSTORMING,
    isVoting: stage === Stage.VOTE,
    isAction: stage === Stage.ACTIONS,
    isDone: stage === Stage.DONE,
  };
}
