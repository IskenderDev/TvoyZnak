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
    <div className="flex items-center justify-center gap-2 font-road">
      <button
        onClick={handlePrev}
        className="px-3 py-2 text-2xl text-foreground/60 transition-colors hover:text-foreground"
        aria-label="Предыдущая страница"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`h-9 w-9 rounded-md font-medium transition-colors ${
            page === n
              ? "bg-primary-500 text-primary-foreground"
              : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
          }`}
        >
          {n}
        </button>
      ))}

      <button
        onClick={handleNext}
        className="px-3 py-2 text-2xl text-foreground/60 transition-colors hover:text-foreground"
        aria-label="Следующая страница"
      >
        ›
      </button>
    </div>
  );
}
