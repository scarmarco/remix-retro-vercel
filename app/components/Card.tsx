import { Form, useTransition } from "remix";
import type { Comment } from "@prisma/client";

export default function Card({
  placeholder,
  type,
  items = [],
}: {
  placeholder: string;
  type: string;
  items?: Comment[];
}) {
  const { state } = useTransition();

  return (
    <div className="h-full bg-white p-3 rounded">
      <div className="mb-2">
        <Form method="post">
          <input
            className="w-full border border-gray-300 rounded px-2 py-1"
            type="text"
            name="comment"
            placeholder={placeholder}
            disabled={state === "submitting"}
          />
          <input type="hidden" name="type" value={type} />
        </Form>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(({ id, text }) => (
          <div key={id} className="text-gray-700">
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
