import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_PLATE_VALUE, type PlateSelectValue } from "@/features/plate-select/model/types";
import { carNumberLotsApi } from "@/shared/services/carNumberLotsApi";
import type { CarNumberLotsFiltersState, SortDir } from "./types";
import { filterCarNumberLots } from "../lib/filterCarNumberLots";
import type { CarNumberLot } from "@/entities/car-number-lot/types";

const DEFAULT_LIMIT = 8;

const createInitialState = (): CarNumberLotsFiltersState => ({
  region: "",
  category: "",
  sortDir: "asc",
  plateQuery: { ...DEFAULT_PLATE_VALUE },
});

const CATEGORY_LABELS: Record<string, string> = {
  "same-digits": "Одинаковые цифры",
  "same-letters": "Одинаковые буквы",
  mirror: "Зеркальные",
  vip: "VIP",
  random: "Случайные",
  hidden: "Прочие",
};

export const useCarNumberLotsMarket = (initialLimit = DEFAULT_LIMIT) => {
  const [filters, setFilters] = useState<CarNumberLotsFiltersState>(() => createInitialState());
  const [limit, setLimit] = useState(initialLimit);
  const [items, setItems] = useState<CarNumberLot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carNumberLotsApi.list();
      setItems(data);
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "Не удалось загрузить объявления");
      setError(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const regionOptions = useMemo(() => {
    const base = new Set<string>();
    items.forEach((item) => {
      if (item.region) {
        base.add(String(item.region));
      } else if (item.plate.regionId) {
        base.add(String(item.plate.regionId));
      }
    });

    return [
      { label: "Все регионы", value: "" },
      ...Array.from(base)
        .sort((a, b) => a.localeCompare(b, "ru"))
        .map((value) => ({ label: value, value })),
    ];
  }, [items]);

  const categoryOptions = useMemo(() => {
    const base = new Set<string>();
    items.forEach((item) => {
      if (item.category) {
        base.add(item.category);
      }
    });

    return [
      { label: "Все категории", value: "" },
      ...Array.from(base).map((value) => ({
        value,
        label: CATEGORY_LABELS[value] ?? capitalize(value),
      })),
    ];
  }, [items]);

  const filteredPlates = useMemo(() => filterCarNumberLots(items, filters), [items, filters]);
  const visibleRows = useMemo(() => filteredPlates.slice(0, limit), [filteredPlates, limit]);
  const canShowMore = limit < filteredPlates.length;

  const setRegion = useCallback(
    (region: string) => {
      setFilters((prev) => ({ ...prev, region }));
      setLimit(initialLimit);
    },
    [initialLimit],
  );

  const setCategory = useCallback(
    (category: string) => {
      setFilters((prev) => ({ ...prev, category }));
      setLimit(initialLimit);
    },
    [initialLimit],
  );

  const setPlateQuery = useCallback(
    (plateQuery: PlateSelectValue) => {
      setFilters((prev) => ({ ...prev, plateQuery }));
      setLimit(initialLimit);
    },
    [initialLimit],
  );

  const toggleSortDir = useCallback(() => {
    setFilters((prev) => ({ ...prev, sortDir: prev.sortDir === "asc" ? "desc" : "asc" }));
  }, []);

  const setSortDir = useCallback((sortDir: SortDir) => {
    setFilters((prev) => ({ ...prev, sortDir }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(createInitialState());
    setLimit(initialLimit);
  }, [initialLimit]);

  const showMore = useCallback(() => {
    setLimit((prev) => prev + initialLimit);
  }, [initialLimit]);

  return {
    filters,
    items,
    loading,
    error,
    region: filters.region,
    category: filters.category,
    sortDir: filters.sortDir,
    plateQuery: filters.plateQuery,
    limit,
    regionOptions,
    categoryOptions,
    filteredPlates,
    visibleRows,
    canShowMore,
    setRegion,
    setCategory,
    setPlateQuery,
    setSortDir,
    toggleSortDir,
    resetFilters,
    showMore,
    reload: load,
  };
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const withMessage = error as { message?: unknown; response?: { data?: { message?: unknown; error?: unknown } } };
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
