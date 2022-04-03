import { Form } from "remix";
import { Fragment } from "react";
import { Stage } from "@prisma/client";
import type { Stage as StageKey, Board } from "@prisma/client";
import cls from "classnames";

import { getCurrentStage } from "~/utils";

const stagesName = {
  [Stage.BRAINSTORMING]: "Brainstorm",
  [Stage.VOTE]: "Group and vote",
  [Stage.ACTIONS]: "Write actions",
  [Stage.DONE]: "Done",
};

const Stages = Object.keys(Stage) as StageKey[];

export default function StagesBar({ board }: { board: Board }) {
  const { isDone } = getCurrentStage(board.stage);
  return (
    <div className="h-12 flex-none flex items-center px-3 text-gray-700 text-lg font-semibold">
      <div className="flex-1 flex items-center">
        {Stages.map((stageKey) => (
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
            className="border border-gray-800 px-2 py-1 rounded font-semibold hover:ring-1 hover:bg-gray-100 ring-black transition"
            type="submit"
          >
            Next stage
          </button>
        </Form>
      )}
    </div>
  );
}
