import { useFetcher, useParams } from "remix";
import { Stage } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";

export default function Comment({
  id,
  text,
  likes,
  stage,
}: {
  id: string;
  text: string;
  likes: number;
  stage: Stage;
}) {
  const params = useParams();
  const commentFetcher = useFetcher();

  const handleVote = useCallback(() => {
    commentFetcher.submit(
      { commentId: id, likes: `${likes + 1}` },
      { method: "put", action: `board/${params.boardId}/comment` }
    );
  }, []);

  return (
    <div className="flex justify-between items-center px-2">
      <span className="text-gray-700">{text}</span>
      {stage === Stage.VOTE && (
        <div className="text-gray-500 flex items-center">
          <FontAwesomeIcon
            icon={faThumbsUp}
            className="text-sm"
            onClick={handleVote}
          />
          <span className="ml-2">{likes}</span>
        </div>
      )}
    </div>
  );
}
