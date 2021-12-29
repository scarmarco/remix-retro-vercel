import { useFetcher } from "remix";
import { useEffect, useRef } from "react";
import cls from "classnames";
import type { Comment, Board } from "@prisma/client";

import Commentary from "./Comment";

export default function Card({
  placeholder,
  type,
  items = [],
  disabled,
  board,
}: {
  placeholder: string;
  type: string;
  items?: Comment[];
  disabled?: boolean;
  board: Board;
}) {
  const commentFetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id, stage } = board;

  useEffect(() => {
    if (commentFetcher.type === "done" && commentFetcher.data.clearForm) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [commentFetcher]);

  return (
    <div
      className={cls("h-full bg-white p-3 rounded-lg shadow-sm", {
        "opacity-50 pointer-events-none": disabled,
      })}
    >
      <div className="mb-2">
        <commentFetcher.Form
          method="post"
          ref={formRef}
          action={`/board/${id}/comment`}
          autoComplete="off"
        >
          <input
            className="w-full border border-gray-300 rounded px-2 py-1"
            type="text"
            name="comment"
            ref={inputRef}
            placeholder={placeholder}
            disabled={commentFetcher.state === "submitting"}
            required
          />
          <input type="hidden" name="type" value={type} />
        </commentFetcher.Form>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Commentary key={item.id} stage={stage} {...item} />
        ))}
      </div>
    </div>
  );
}
