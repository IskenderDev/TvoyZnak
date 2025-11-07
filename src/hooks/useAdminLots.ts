import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import {
  fetchAdminLots,
  confirmLot as apiConfirmLot,
  updateLot as apiUpdateLot,
  deleteLot as apiDeleteLot,
  type AdminLot,
  type UpdateAdminLotPayload,
} from "@/api/adminLots";

export type AdminLotStatusFilter = "all" | "confirmed" | "pending";
export type AdminLotSortKey = "createdDate" | "originalPrice" | "markupPrice";
export type SortDirection = "asc" | "desc";

const DEFAULT_PAGE_SIZE = 10;

export const useAdminLots = () => {
  const [lots, setLots] = useState<AdminLot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AdminLotStatusFilter>("all");
  const [sortBy, setSortBy] = useState<AdminLotSortKey>("createdDate");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [confirmingIds, setConfirmingIds] = useState<ReadonlySet<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<ReadonlySet<number>>(new Set());
  const [updatingIds, setUpdatingIds] = useState<ReadonlySet<number>>(new Set());

  const abortRef = useRef<AbortController | null>(null);
  const lotsRef = useRef<AdminLot[]>([]);

  useEffect(() => {
    lotsRef.current = lots;
  }, [lots]);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminLots(controller.signal);
      setLots(data);
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === "CanceledError") {
        return;
      }
      const message = extractErrorMessage(err, "Не удалось загрузить лоты");
      setError(message);
      setLots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const normalisedSearch = useMemo(() => search.trim().toLowerCase(), [search]);

  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      const matchesStatus =
        status === "all" || (status === "confirmed" ? lot.isConfirm : !lot.isConfirm);

      if (!matchesStatus) {
        return false;
      }

      if (!normalisedSearch) {
        return true;
      }

      const haystack = [
        lot.fullCarNumber,
        lot.fullName,
        lot.phoneNumber,
        lot.regionCode,
        lot.comment,
        lot.author?.fullName,
        lot.author?.phoneNumber,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      return haystack.some((value) => value.includes(normalisedSearch));
    });
  }, [lots, normalisedSearch, status]);

  const sortedLots = useMemo(() => {
    const compare = createComparator(sortBy, sortDir);
    return [...filteredLots].sort(compare);
  }, [filteredLots, sortBy, sortDir]);

  const totalItems = sortedLots.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedLots = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedLots.slice(start, start + pageSize);
  }, [sortedLots, page, pageSize]);

  const handleSetSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleSetStatus = useCallback((value: AdminLotStatusFilter) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleSetPageSize = useCallback((value: number) => {
    setPageSize(value);
    setPage(1);
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const changeSortBy = useCallback((key: AdminLotSortKey) => {
    setSortBy((prev) => {
      if (prev === key) {
        return prev;
      }
      setSortDir(key === "createdDate" ? "desc" : "asc");
      return key;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
    setSortBy("createdDate");
    setSortDir("desc");
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
  }, []);

  const confirm = useCallback(
    async (id: number) => {
      setConfirmingIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      const snapshot = lotsRef.current.map((lot) => ({ ...lot }));
      setLots((prev) => prev.map((lot) => (lot.id === id ? { ...lot, isConfirm: true } : lot)));

      try {
        await apiConfirmLot(id);
        toast.success("Лот подтверждён");
      } catch (err) {
        setLots(snapshot);
        toast.error(extractErrorMessage(err, "Не удалось подтвердить лот"));
        throw err;
      } finally {
        setConfirmingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [],
  );

  const update = useCallback(
    async (id: number, payload: UpdateAdminLotPayload) => {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      try {
        const updated = await apiUpdateLot(id, payload);
        setLots((prev) =>
          prev.map((lot) =>
            lot.id === id
              ? {
                  ...lot,
                  ...updated,
                  firstLetter: updated.firstLetter ?? payload.firstLetter,
                  secondLetter: updated.secondLetter ?? payload.secondLetter,
                  thirdLetter: updated.thirdLetter ?? payload.thirdLetter,
                  firstDigit: updated.firstDigit ?? payload.firstDigit,
                  secondDigit: updated.secondDigit ?? payload.secondDigit,
                  thirdDigit: updated.thirdDigit ?? payload.thirdDigit,
                  regionId: updated.regionId ?? payload.regionId,
                  markupPrice: updated.markupPrice ?? payload.markupPrice,
                  comment: updated.comment ?? payload.comment ?? "",
                  regionCode: updated.regionCode ?? lot.regionCode,
                }
              : lot,
          ),
        );
        toast.success("Лот обновлён");
        return updated;
      } catch (err) {
        toast.error(extractErrorMessage(err, "Не удалось обновить лот"));
        throw err;
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [],
  );

  const remove = useCallback(
    async (id: number) => {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      const snapshot = lotsRef.current.map((lot) => ({ ...lot }));
      setLots((prev) => prev.filter((lot) => lot.id !== id));

      try {
        await apiDeleteLot(id);
        toast.success("Лот удалён");
      } catch (err) {
        setLots(snapshot);
        toast.error(extractErrorMessage(err, "Не удалось удалить лот"));
        throw err;
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [],
  );

  return {
    lots,
    loading,
    error,
    page,
    pageSize,
    totalItems,
    totalPages,
    paginatedLots,
    filteredLots,
    search,
    status,
    sortBy,
    sortDir,
    confirmingIds,
    deletingIds,
    updatingIds,
    setPage,
    setSortBy: changeSortBy,
    setSortDir,
    toggleSortDirection,
    setSearch: handleSetSearch,
    setStatus: handleSetStatus,
    setPageSize: handleSetPageSize,
    resetFilters,
    confirm,
    update,
    remove,
    reload: load,
  };
};

const createComparator = (sortBy: AdminLotSortKey, sortDir: SortDirection) => {
  return (a: AdminLot, b: AdminLot) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortBy) {
      case "originalPrice": {
        return dir * (a.originalPrice - b.originalPrice);
      }
      case "markupPrice": {
        return dir * (a.markupPrice - b.markupPrice);
      }
      case "createdDate":
      default: {
        const dateA = new Date(a.createdDate).getTime();
        const dateB = new Date(b.createdDate).getTime();
        return dir * (dateA - dateB);
      }
    }
  };
};

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const withMessage = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown } };
    };
    const responseMessage = withMessage.response?.data?.message;
    const responseError = withMessage.response?.data?.error;
    const message = withMessage.message;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }
    if (typeof responseError === "string" && responseError.trim()) {
      return responseError;
    }
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
};

