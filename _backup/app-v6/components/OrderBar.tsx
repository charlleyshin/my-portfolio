interface OrderBarProps {
  totalCount: number;
  totalPrice: number;
  onOrder: () => void;
}

export default function OrderBar({ totalCount, totalPrice, onOrder }: OrderBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-900 text-white py-4 px-6 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-stone-400">
            총 <span className="text-white font-semibold">{totalCount}개</span>
          </span>
          <span className="text-amber-400 text-xl font-bold">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
        <button
          onClick={onOrder}
          className="bg-amber-500 text-white px-8 py-2.5 rounded-full font-medium hover:bg-amber-600 transition-colors"
        >
          주문하기
        </button>
      </div>
    </div>
  );
}
