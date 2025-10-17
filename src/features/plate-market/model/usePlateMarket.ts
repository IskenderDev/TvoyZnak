import { useCallback, useMemo, useState } from "react"
import { PLATES } from "@/data/plates"
import { REGION_OPTS, CATEGORY_OPTS } from "@/data/filters"
import { DEFAULT_PLATE_VALUE, type PlateSelectValue } from "@/shared/components/plate/PlateSelectForm"
import { filterPlates } from "../lib/filterPlates"
import type { PlateMarketFiltersState, SortDir } from "./types"

const DEFAULT_LIMIT = 8

const createInitialState = (): PlateMarketFiltersState => ({
  region: "",
  category: "",
  sortDir: "asc",
  plateQuery: { ...DEFAULT_PLATE_VALUE },
})

export const usePlateMarket = (initialLimit = DEFAULT_LIMIT) => {
  const [filters, setFilters] = useState<PlateMarketFiltersState>(() => createInitialState())
  const [limit, setLimit] = useState(initialLimit)

  const regionOptions = useMemo(
    () => [{ label: "Все регионы", value: "" }, ...REGION_OPTS],
    []
  )

  const categoryOptions = useMemo(
    () => [{ label: "Все категории", value: "" }, ...CATEGORY_OPTS],
    []
  )

  const filteredPlates = useMemo(() => filterPlates(PLATES, filters), [filters])

  const visibleRows = useMemo(() => filteredPlates.slice(0, limit), [filteredPlates, limit])
  const canShowMore = limit < filteredPlates.length

  const setRegion = useCallback((region: string) => {
    setFilters((prev) => ({ ...prev, region }))
    setLimit(initialLimit)
  }, [initialLimit])

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }))
    setLimit(initialLimit)
  }, [initialLimit])

  const setPlateQuery = useCallback((plateQuery: PlateSelectValue) => {
    setFilters((prev) => ({ ...prev, plateQuery }))
    setLimit(initialLimit)
  }, [initialLimit])

  const toggleSortDir = useCallback(() => {
    setFilters((prev) => ({ ...prev, sortDir: prev.sortDir === "asc" ? "desc" : "asc" }))
  }, [])

  const setSortDir = useCallback((sortDir: SortDir) => {
    setFilters((prev) => ({ ...prev, sortDir }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(createInitialState())
    setLimit(initialLimit)
  }, [initialLimit])

  const showMore = useCallback(() => {
    setLimit((prev) => prev + initialLimit)
  }, [initialLimit])

  return {
    filters,
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
  }
}
