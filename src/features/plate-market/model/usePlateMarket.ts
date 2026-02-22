import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_PLATE_VALUE, type PlateSelectValue } from "@/features/plate-select/model/types";
import { numbersApi } from "@/shared/services/numbersApi";
import { regionsApi, type Region } from "@/shared/services/regionsApi";
import { CATEGORY_LABELS, PLATE_CATEGORIES } from "@/shared/lib/categories";
import type { PlateMarketFiltersState, SortField } from "./types";
import { filterPlates } from "../lib/filterPlates";
import type { NumberItem } from "@/entities/number/types";

const DEFAULT_LIMIT = 8;

const PRIORITY_REGION_NAMES = [
  "Москва",
  "Московская область",
  "Санкт-Петербург",
  "Ленинградская область",
];

const createInitialState = (): PlateMarketFiltersState => ({
  region: "",
  category: "",
  sortField: "date",
  sortDir: "desc",
  plateQuery: { ...DEFAULT_PLATE_VALUE },
});

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
      setError(extractErrorMessage(err, "Не удалось загрузить номера"));
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
        if (active) setRegions(data);
      } catch (err: unknown) {
        if (active) {
          setRegionsError(extractErrorMessage(err, "Не удалось загрузить регионы"));
        }
      }
    };

    void loadRegions();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (regionsError) setError((prev) => prev ?? regionsError);
  }, [regionsError]);

  const regionLabels = useMemo(() => {
    const map = new Map<string, string>();
    regions.forEach((r) => {
      if (r.regionCode) {
        map.set(String(r.regionCode), r.regionName || String(r.regionCode));
      }
    });
    return map;
  }, [regions]);

  const regionOptions = useMemo(() => {
    const usedCodes = new Set<string>();

    items.forEach((item) => {
      if (item.region) usedCodes.add(String(item.region));
      else if (item.plate.regionCode) usedCodes.add(String(item.plate.regionCode));
    });

    const labelToCodes = new Map<string, Set<string>>();

    usedCodes.forEach((code) => {
      const label = (regionLabels.get(code) ?? code).trim();
      if (!labelToCodes.has(label)) {
        labelToCodes.set(label, new Set());
      }
      labelToCodes.get(label)!.add(code);
    });

    const priority: { label: string; value: string }[] = [];
    const regular: { label: string; value: string }[] = [];

    Array.from(labelToCodes.keys()).forEach((label) => {
      const option = { label, value: label };
      if (PRIORITY_REGION_NAMES.includes(label)) {
        priority.push(option);
      } else {
        regular.push(option);
      }
    });

    regular.sort((a, b) => a.label.localeCompare(b.label, "ru"));

    return [{ label: "Все регионы", value: "" }, ...priority, ...regular];
  }, [items, regionLabels]);

  const categoryOptions = useMemo(
    () => [
      { label: "Все категории", value: "" },
      ...PLATE_CATEGORIES.map((value) => ({
        value,
        label: CATEGORY_LABELS[value],
      })),
    ],
    [],
  );

  const itemsForRegion = useMemo(() => {
    if (!filters.region) return items;

    const allowedCodes = new Set<string>();
    regionLabels.forEach((name, code) => {
      if (name === filters.region) {
        allowedCodes.add(code);
      }
    });

    if (!allowedCodes.size) return items;

    return items.filter((item) => {
      const code = item.region
        ? String(item.region)
        : item.plate.regionCode
        ? String(item.plate.regionCode)
        : "";
      return allowedCodes.has(code);
    });
  }, [items, filters.region, regionLabels]);

  const filteredPlates = useMemo(
    () => filterPlates(itemsForRegion, { ...filters, region: "" }),
    [itemsForRegion, filters],
  );

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
    setFilters((prev) =>
      prev.sortField !== field
        ? { ...prev, sortField: field, sortDir: "desc" }
        : { ...prev, sortDir: prev.sortDir === "asc" ? "desc" : "asc" },
    );
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

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) return error;

  if (error && typeof error === "object") {
    const e = error as { message?: unknown; response?: { data?: { message?: unknown; error?: unknown } } };
    if (typeof e.response?.data?.message === "string") return e.response.data.message;
    if (typeof e.response?.data?.error === "string") return e.response.data.error;
    if (typeof e.message === "string") return e.message;
  }

  return fallback;
};
