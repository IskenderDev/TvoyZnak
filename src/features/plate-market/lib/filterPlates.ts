import type { PlateSelectValue } from "@/features/plate-select/model/types"
import type { PlateMarketFiltersState } from "../model/types"
import type { NumberItem } from "@/entities/number/types"

const hasAnyChar = (value: string) => value.split("").some((char) => char !== "*")

const matchPlateText = (pattern: string, row: NumberItem) => {
  const raw = `${row.plate.firstLetter}${row.plate.firstDigit}${row.plate.secondDigit}${row.plate.thirdDigit}${row.plate.secondLetter}${row.plate.thirdLetter}`

  return pattern
    .split("")
    .every((char, idx) => char === "*" || char === raw[idx])
}

const matchesTextQuery = (query: PlateSelectValue, row: NumberItem) => {
  if (!hasAnyChar(query.text)) return true
  return matchPlateText(query.text, row)
}

const matchesRegion = (query: PlateSelectValue, row: NumberItem) => {
  const normalizedRegion =
    query.regionCode && query.regionCode !== "*" ? query.regionCode : ""
  if (!normalizedRegion) return true
  return String(row.plate.regionId) === normalizedRegion || row.region === normalizedRegion
}

const applyFilters = (row: NumberItem, filters: PlateMarketFiltersState) => {
  if (filters.region && !(String(row.plate.regionId) === filters.region || row.region === filters.region)) {
    return false
  }

  if (filters.category && !row.categories?.includes(filters.category)) {
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

const getDateValue = (value: string) => {
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

const applySorting = (a: NumberItem, b: NumberItem, filters: PlateMarketFiltersState) => {
  if (filters.sortField === "price") {
    return filters.sortDir === "asc" ? a.price - b.price : b.price - a.price
  }

  const aDate = getDateValue(a.date)
  const bDate = getDateValue(b.date)
  return filters.sortDir === "asc" ? aDate - bDate : bDate - aDate
}

export const filterPlates = (plates: NumberItem[], filters: PlateMarketFiltersState) => {
  const filtered = plates.filter((row) => applyFilters(row, filters))
  return filtered.sort((a, b) => applySorting(a, b, filters))
}
