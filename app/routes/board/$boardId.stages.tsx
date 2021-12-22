import { useLoaderData, useFetcher, json } from "remix";
import { Stage } from "@prisma/client";
import invariant from "tiny-invariant";
import type { ActionFunction, LoaderFunction } from "remix";
import type { Stage as StageKey } from "@prisma/client";
import type { BoardLoader } from "~/types";

import { db } from "~/db.server";

const stagesName = {
  [Stage.BRAINSTORMING]: "Brainstorming",
  [Stage.VOTE]: "Group and voting",
  [Stage.ACTIONS]: "Write actions",
  [Stage.DONE]: "Done",
};

const Stages = Object.keys(Stage) as StageKey[];

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.boardId, "Expected params.boardId");
  const form = await request.formData();
  const currentStage = form.get("currentStage") as StageKey;

  const currentStageIdx = Stages.indexOf(currentStage);
  const nextStage = Stages[currentStageIdx + 1] ?? Stages[Stages.length - 1];

  await db.board.update({
    where: { id: params.boardId },
    data: { stage: nextStage },
  });

  const board = await db.board.findUnique({
    where: { id: params.boardId },
  });

  return json({ ok: true, board });
};

export default function StagesBar() {
  const { board } = useLoaderData<BoardLoader>();
  const nextStage = useFetcher();

  const handleNextStage = () => {
    nextStage.submit(
      {
        currentStage: board.stage,
      },
      { method: "post", action: `/board/${board.id}/stages` }
    );
  };

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
      <nextStage.Form>
        <button
          className="border border-gray-800 px-2 py-1 rounded font-semibold"
          onClick={handleNextStage}
        >
          Next stage
        </button>
      </nextStage.Form>
    </div>
  );
}
