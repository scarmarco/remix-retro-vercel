import { useFetcher } from "remix";
import { useEffect, useRef } from "react";
import type { Comment } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export default function Card({
  placeholder,
  type,
  items = [],
}: {
  placeholder: string;
  type: string;
  items?: Comment[];
}) {
  const comment = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (comment.type === "done" && comment.data.ok) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [comment]);

  return (
    <div className="h-full bg-white p-3 rounded">
      <div className="mb-2">
        <comment.Form method="post" ref={formRef}>
          <input
            className="w-full border border-gray-300 rounded px-2 py-1"
            type="text"
            name="comment"
            ref={inputRef}
            placeholder={placeholder}
            disabled={comment.state === "submitting"}
            required
          />
          <input type="hidden" name="type" value={type} />
        </comment.Form>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(({ id, text, likes }) => (
          <div key={id} className="flex justify-between items-center px-2">
            <span className="text-gray-700">{text}</span>
            <div className="text-sm text-gray-500">
              <FontAwesomeIcon icon={faThumbsUp} />
              <span className="ml-2">{likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
