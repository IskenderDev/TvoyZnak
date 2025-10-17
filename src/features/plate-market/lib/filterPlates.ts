import type { PlateRow } from "@/data/plates"
import type { PlateSelectValue } from "@/features/plate-select/ui/PlateSelectForm"
import type { PlateMarketFiltersState } from "../model/types"

const hasAnyChar = (value: string) => value.split("").some((char) => char !== "*")

const matchPlateText = (pattern: string, row: PlateRow) => {
  const raw = `${row.plate.firstLetter}${row.plate.firstDigit}${row.plate.secondDigit}${row.plate.thirdDigit}${row.plate.secondLetter}${row.plate.thirdLetter}`

  return pattern
    .split("")
    .every((char, idx) => char === "*" || char === raw[idx])
}

const matchesTextQuery = (query: PlateSelectValue, row: PlateRow) => {
  if (!hasAnyChar(query.text)) return true
  return matchPlateText(query.text, row)
}

const matchesRegion = (query: PlateSelectValue, row: PlateRow) => {
  const normalizedRegion = query.region && query.region !== "*" ? query.region : ""
  if (!normalizedRegion) return true
  return String(row.plate.regionId) === normalizedRegion
}

const applyFilters = (row: PlateRow, filters: PlateMarketFiltersState) => {
  if (filters.region && !(String(row.plate.regionId) === filters.region || row.region === filters.region)) {
    return false
  }

  if (filters.category && row.category !== filters.category) {
    return false
  }

  if (!matchesRegion(filters.plateQuery, row)) {
    return false
  }

  if (!matchesTextQuery(filters.plateQuery, row)) {
    return false
  }

  return true
}

const applySorting = (a: PlateRow, b: PlateRow, sortDir: PlateMarketFiltersState["sortDir"]) =>
  sortDir === "asc" ? a.price - b.price : b.price - a.price

export const filterPlates = (plates: PlateRow[], filters: PlateMarketFiltersState) => {
  const filtered = plates.filter((row) => applyFilters(row, filters))
  return filtered.sort((a, b) => applySorting(a, b, filters.sortDir))
}
