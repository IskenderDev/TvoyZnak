import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_PLATE_VALUE, type PlateSelectValue } from "@/features/plate-select/model/types";
import { numbersApi } from "@/shared/services/numbersApi";
import { regionsApi, type Region } from "@/shared/services/regionsApi";
import type { PlateMarketFiltersState, SortField } from "./types";
import { filterPlates } from "../lib/filterPlates";
import type { NumberItem } from "@/entities/number/types";

const DEFAULT_LIMIT = 8;

const createInitialState = (): PlateMarketFiltersState => ({
  region: "",
  category: "",
  sortField: "date",
  sortDir: "desc",
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

export const usePlateMarket = (initialLimit = DEFAULT_LIMIT) => {
  const [filters, setFilters] = useState<PlateMarketFiltersState>(() => createInitialState());
  const [limit, setLimit] = useState(initialLimit);
  const [items, setItems] = useState<NumberItem[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regionsError, setRegionsError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await numbersApi.list();
      setItems(data);
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "Не удалось загрузить номера");
      setError(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let active = true;

    const loadRegions = async () => {
      try {
        const data = await regionsApi.list();
        if (active) {
          setRegions(data);
        }
      } catch (err: unknown) {
        if (active) {
          const message = extractErrorMessage(err, "Не удалось загрузить регионы");
          setRegionsError(message);
        }
      }
    };

    void loadRegions();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (regionsError) {
      setError((prev) => prev ?? regionsError);
    }
  }, [regionsError]);

  const regionLabels = useMemo(() => {
    const labels = new Map<string, string>();
    regions.forEach((region) => {
      if (region.regionCode) {
        labels.set(region.regionCode, region.regionName || region.regionCode);
      }
    });
    return labels;
  }, [regions]);

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
        .map((value) => ({
          value,
          label: regionLabels.get(value) ?? value,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, "ru")),
    ];
  }, [items, regionLabels]);

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

  const filteredPlates = useMemo(() => filterPlates(items, filters), [items, filters]);
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

  const onSort = useCallback((field: SortField) => {
    setFilters((prev) => {
      if (prev.sortField !== field) {
        return { ...prev, sortField: field, sortDir: "desc" };
      }

      return { ...prev, sortDir: prev.sortDir === "asc" ? "desc" : "asc" };
    });
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
    sortField: filters.sortField,
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
    onSort,
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
