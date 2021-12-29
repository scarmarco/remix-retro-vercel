import { Form, useSubmit } from "remix";
import { Stage } from "@prisma/client";
import type { Stage as StageKey, Board } from "@prisma/client";

const stagesName = {
  [Stage.BRAINSTORMING]: "Brainstorming",
  [Stage.VOTE]: "Group and voting",
  [Stage.ACTIONS]: "Write actions",
  [Stage.DONE]: "Done",
};

const Stages = Object.keys(Stage) as StageKey[];

export default function StagesBar({ board }: { board: Board }) {
  return (
    <div className="h-12 flex items-center px-3 text-gray-700 font-semibold">
      <div className="flex-1 flex">
        {Stages.map((stageKey) => (
          <div
            key={stageKey}
            className={`mr-4 opacity-20 ${
              stageKey === board.stage && "opacity-100"
            }`}
          >
            {stagesName[stageKey]}
          </div>
        ))}
      </div>
      <Form action={`/board/${board.id}`} method="put">
        <input type="hidden" name="currentStage" value={board.stage} />
        <button
          className="border border-gray-800 px-2 py-1 rounded font-semibold"
          type="submit"
        >
          Next stage
        </button>
      </Form>
    </div>
  );
}
