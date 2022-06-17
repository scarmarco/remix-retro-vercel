import { useEffect, useState } from "react";
import { useParams } from "@remix-run/react";
import { eventType } from "~/utils";
import type { Payload } from "~/routes/board/$boardId";

export function useBoardEvents(initialData: Payload) {
  const params = useParams();

  const [board, setBoard] = useState(initialData.board);
  const [commentsByType, setCommentsByType] = useState(
    initialData.commentsByType
  );

  useEffect(() => {
    const eventSource = new EventSource(`/board/${params.boardId}/events`);

    eventSource.addEventListener(eventType.NEW_COMMENT, (event) => {
      const newComment = JSON.parse(event.data);
      setCommentsByType((prevState) => ({
        ...prevState,
        [newComment.type]: [...(prevState[newComment.type] || []), newComment],
      }));
    });

    eventSource.addEventListener(eventType.GROUP_COMMENT, (event) => {
      const { comment, childrenId } = JSON.parse(event.data);
      setCommentsByType((prevState) => ({
        ...prevState,
        [comment.type]: prevState[comment.type]
          .filter(({ id }) => id !== childrenId)
          .map((currentComment) =>
            currentComment.id === comment.id ? comment : currentComment
          ),
      }));
    });

    eventSource.addEventListener(eventType.UNGROUP_COMMENT, (event) => {
      const { comment, childrenId } = JSON.parse(event.data);
      setCommentsByType((prevState) => {
        const oldParentComment = prevState[comment.type].find(
          ({ id }) => id === comment.id
        );
        const childComment = oldParentComment?.childrens.find(
          ({ id }) => id === childrenId
        );
        return {
          ...prevState,
          [comment.type]: [
            ...prevState[comment.type].map((currentComment) =>
              currentComment.id === comment.id ? comment : currentComment
            ),
            { ...childComment, childrens: [] },
          ],
        };
      });
    });

    eventSource.addEventListener(eventType.LIKE_COMMENT, (event) => {
      const comment = JSON.parse(event.data);
      setCommentsByType((prevState) => ({
        ...prevState,
        [comment.type]: prevState[comment.type].map((currentComment) =>
          currentComment.id === comment.id ? comment : currentComment
        ),
      }));
    });

    eventSource.addEventListener(eventType.CHANGE_STAGE, (event) => {
      const stage = event.data;
      setBoard((prevState) => ({ ...prevState, stage }));
    });

    return () => eventSource.close();
  }, []);

  return { board, commentsByType };
}
