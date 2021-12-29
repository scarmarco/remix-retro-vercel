import { Form } from "remix";
import { Fragment } from "react";
import { Stage } from "@prisma/client";
import type { Stage as StageKey, Board } from "@prisma/client";
import cls from "classnames";

import { getCurrentStage } from "~/utils";

const stagesName = {
  [Stage.BRAINSTORMING]: "Brainstorming",
  [Stage.VOTE]: "Group and voting",
  [Stage.ACTIONS]: "Write actions",
  [Stage.DONE]: "Done",
};

const Stages = Object.keys(Stage) as StageKey[];

export default function StagesBar({ board }: { board: Board }) {
  const { isDone } = getCurrentStage(board.stage);
  return (
    <div className="h-12 flex items-center px-3 text-gray-700 font-semibold">
      <div className="flex-1 flex items-center">
        {Stages.map((stageKey, idx) => (
          <Fragment key={stageKey}>
            <div
              className={cls(
                { "opacity-20": stageKey !== board.stage },
                { "opacity-100": stageKey === board.stage }
              )}
            >
              {stagesName[stageKey]}
            </div>
            <span className="mx-2 text-gray-400 last:hidden">&gt;</span>
          </Fragment>
        ))}
      </div>
      {!isDone && (
        <Form action={`/board/${board.id}`} method="put">
          <input type="hidden" name="currentStage" value={board.stage} />
          <button
            className="border border-gray-800 px-2 py-1 rounded font-semibold"
            type="submit"
          >
            Next stage
          </button>
        </Form>
      )}
    </div>
  );
}
