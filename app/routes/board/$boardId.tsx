import { useParams } from "remix";

import Card from "~/components/Card";

const items = [
  { id: 1, text: "some" },
  { id: 2, text: "other" },
  { id: 3, text: "new" },
];

export default function BoardRoute() {
  const params = useParams();
  console.log(params.boardId);

  return (
    <div className="h-full bg-gray-300 flex p-3 gap-3">
      <div className="flex-1">
        <Card placeholder="It worked" items={items} />
      </div>
      <div className="flex-1">
        <Card placeholder="To improve" />
      </div>
      <div className="flex-1">
        <Card placeholder="To ask" />
      </div>
      <div className="flex-1">
        <Card placeholder="To do" />
      </div>
    </div>
  );
}
