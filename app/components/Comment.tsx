import { useFetcher, useParams } from "@remix-run/react";
import { useCallback, useEffect, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Stage } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import cls from "classnames";

import { getCurrentStage } from "~/utils";
import { Comment } from "~/types";
import ChildComment from "./ChildComment";

type Props = Comment & {
  stage: Stage;
  columnType: string;
  hideLikes?: boolean;
};

export default function Comment({
  id,
  text,
  likes,
  stage,
  columnType,
  childrens,
  hideLikes = false,
}: Props) {
  const ref = useRef(null);
  const params = useParams();
  const fetcher = useFetcher();
  const [disabled, setDisabled] = useState(false);
  const { isBrainstorming, isVoting } = getCurrentStage(stage);

  const canDrag = isVoting && !childrens.length;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: columnType,
    item: () => ({ id }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => canDrag,
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: columnType,
    drop: (item: Comment) => {
      if (item && id !== item.id) {
        fetcher.submit(
          { commentId: id, childId: item.id, type: "group" },
          { method: "put", action: `/board/${params.boardId}/comment` }
        );
      }
    },
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  }));

  useEffect(() => {
    if (fetcher.type === "done" && fetcher.data.voted) {
      setDisabled(true);
    }
  }, [fetcher]);

  const handleVote = useCallback(() => {
    fetcher.submit(
      { commentId: id, type: "vote" },
      { method: "put", action: `/board/${params.boardId}/comment` }
    );
  }, [id]);

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cls("flex-none px-2 py-1 m-1", {
        "opacity-0": isDragging,
        "opacity-100": !isDragging,
        "cursor-move": canDrag,
        "outline-2 outline-dashed outline-blue-400 bg-blue-100": isOver,
      })}
    >
      <div className="flex justify-between items-center">
        <p className="text-gray-700 text-lg overflow-hidden">{text}</p>
        {!isBrainstorming && !hideLikes && (
          <div
            className={cls(
              "text-gray-500 flex items-center ml-2 transition-colors hover:text-gray-700",
              {
                "pointer-events-none cursor-not-allowed opacity-40 select-none":
                  disabled || !isVoting,
                "cursor-pointer": isVoting,
              }
            )}
            onClick={handleVote}
          >
            <FontAwesomeIcon icon={faThumbsUp} size="sm" />
            <span className="text-sm font-semibold ml-2">{likes}</span>
          </div>
        )}
      </div>
      <div>
        {childrens.map((childComment) => (
          <ChildComment key={childComment.id} {...childComment} parentId={id} />
        ))}
      </div>
    </div>
  );
}
