import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import cls from "classnames";
import { Board } from "@prisma/client";

import { Comment } from "~/types";
import Commentary from "./Comment";

type Props = {
  placeholder: string;
  type: string;
  items?: Comment[];
  disabled?: boolean;
  inputDisabled?: boolean;
  hideLikes?: boolean;
  board: Board;
  owner: string;
};

export default function Card({
  placeholder,
  type,
  items = [],
  disabled,
  inputDisabled,
  hideLikes,
  board,
  owner,
}: Props) {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id, stage } = board;
  const isInputDisabled = inputDisabled || fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.type === "done" && fetcher.data.clearForm) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [fetcher]);

  return (
    <div
      className={cls("h-full flex flex-col bg-white rounded-lg shadow-sm", {
        "opacity-80 pointer-events-none": disabled,
      })}
    >
      <div className="flex-none p-3">
        <fetcher.Form
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
            disabled={isInputDisabled}
            required
          />
          <input type="hidden" name="type" value={type} />
        </fetcher.Form>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col h-full">
          {items.map((item) => (
            <Commentary
              key={item.id}
              stage={stage}
              hideLikes={hideLikes}
              columnType={type}
              owner={owner}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
