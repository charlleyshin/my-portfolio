interface MenuCardProps {
  emoji: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function MenuCard({
  emoji,
  name,
  description,
  price,
  quantity,
  onAdd,
  onRemove,
}: MenuCardProps) {
  const isSelected = quantity > 0;

  return (
    <div
      className={`bg-white rounded-2xl p-8 text-center transition-all ${
        isSelected
          ? "ring-2 ring-amber-400 shadow-md"
          : "shadow-sm hover:shadow-md"
      }`}
    >
      <span className="text-5xl block mb-5">{emoji}</span>
      <h3 className="text-lg font-medium mb-2">{name}</h3>
      <p className="text-stone-400 text-sm leading-relaxed mb-4">
        {description}
      </p>
      <p className="text-amber-700 font-medium mb-5">
        {price.toLocaleString()}원
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-full bg-stone-200 text-stone-600 font-bold hover:bg-stone-300 transition-colors"
        >
          -
        </button>
        <span className="w-8 text-center font-semibold text-lg">
          {quantity}
        </span>
        <button
          onClick={onAdd}
          className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
