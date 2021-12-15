type Item = {
  id: number;
  text: string;
};

export default function Card({
  placeholder,
  items = [],
}: {
  placeholder: string;
  items?: Item[];
}) {
  return (
    <div className="h-full bg-white p-3 rounded">
      <div className="mb-2">
        <input
          className="w-full border border-gray-300 rounded px-2 py-1"
          type="text"
          placeholder={placeholder}
        />
      </div>
      <div>
        {items.map(({ id, text }) => (
          <div key={id}>{text}</div>
        ))}
      </div>
    </div>
  );
}
