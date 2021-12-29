import { useFetcher, useParams } from "remix";
import { Stage } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import cls from "classnames";

import { getCurrentStage } from "~/utils";

export default function Comment({
  id,
  text,
  likes,
  stage,
  hideLikes = false,
}: {
  id: string;
  text: string;
  likes: number;
  stage: Stage;
  hideLikes?: boolean;
}) {
  const params = useParams();
  const commentFetcher = useFetcher();
  const [disabled, setDisabled] = useState(false);
  const { isBrainstorming, isVoting } = getCurrentStage(stage);

  useEffect(() => {
    if (commentFetcher.type === "done" && commentFetcher.data.voted) {
      setDisabled(true);
    }
  }, [commentFetcher]);

  const handleVote = useCallback(() => {
    commentFetcher.submit(
      { commentId: id, likes: `${likes + 1}` },
      { method: "put", action: `board/${params.boardId}/comment` }
    );
  }, [id, likes]);

  return (
    <div className="flex justify-between items-center px-2">
      <span className="text-gray-700 leading-tight overflow-hidden">
        {text}
      </span>
      {!isBrainstorming && !hideLikes && (
        <div
          className={cls(
            "text-gray-500 cursor-pointer flex items-center ml-2",
            {
              "pointer-events-none cursor-not-allowed opacity-40 select-none":
                disabled,
            }
          )}
          onClick={handleVote}
        >
          <FontAwesomeIcon icon={faThumbsUp} className="text-sm" />
          <span className="ml-2">{likes}</span>
        </div>
      )}
    </div>
  );
}
