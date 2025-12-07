import type { Dispatch, SetStateAction } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: Dispatch<SetStateAction<number>>;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = () => onPageChange((p) => Math.max(1, p - 1));
  const handleNext = () => onPageChange((p) => Math.min(totalPages, p + 1));

  return (
    <div className="flex justify-center items-center gap-2 font-sans">
      <button
        onClick={handlePrev}
        className="px-3 py-2 text-2xl text-white/60 hover:text-white"
        aria-label="Предыдущая страница"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`w-9 h-9 rounded-md font-medium transition-colors ${
            page === n
              ? "bg-[#0177FF] text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          {n}
        </button>
      ))}

      <button
        onClick={handleNext}
        className="px-3 py-2 text-2xl text-white/60 hover:text-white"
        aria-label="Следующая страница"
      >
        ›
      </button>
    </div>
  );
}
