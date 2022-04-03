import { useFetcher, useParams } from "remix";
import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Comment } from "@prisma/client";

type Props = Comment & {
  parentId: string;
};

export default function ChildComment({ parentId, id, text }: Props) {
  const fetcher = useFetcher();
  const params = useParams();

  const handleUngroup = useCallback(() => {
    fetcher.submit(
      { commentId: parentId, childId: id, type: "ungroup" },
      { method: "put", action: `/board/${params.boardId}/comment` }
    );
  }, [id]);

  return (
    <div key={id} className="group h-6 flex items-center text-gray-400">
      <div
        className="hidden group-hover:block pr-2 cursor-pointer"
        onClick={handleUngroup}
      >
        <FontAwesomeIcon icon={faLongArrowAltLeft} size="sm" />
      </div>
      <p className="text-sm ml-4 group-hover:ml-0">{text}</p>
    </div>
  );
}
