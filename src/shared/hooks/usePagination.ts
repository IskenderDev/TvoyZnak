import { useState } from "react";

interface PaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination({ initialPage = 1, initialLimit = 10 }: PaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const next = () => setPage((prev) => prev + 1);
  const prev = () => setPage((prev) => Math.max(prev - 1, 1));
  const reset = () => {
    setPage(initialPage);
    setLimit(initialLimit);
  };

  return { page, limit, setPage, setLimit, next, prev, reset };
}
