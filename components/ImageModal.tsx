"use client";

interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  caption?: string;
  onClose: () => void;
}

export default function ImageModal({
  isOpen,
  imageSrc,
  imageAlt,
  caption,
  onClose,
}: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-amber-400 transition-colors"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* 이미지 컨테이너 */}
      <div
        className="max-w-4xl max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        {caption && (
          <p className="text-white text-center mt-4 text-lg">{caption}</p>
        )}
      </div>
    </div>
  );
}
