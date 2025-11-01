import type { PlateSelectValue } from "@/features/plate-select/model/types";
import type { CarNumberLotsFiltersState } from "../model/types";
import type { CarNumberLot } from "@/entities/car-number-lot/types";

const hasAnyChar = (value: string) => value.split("").some((char) => char !== "*");

const matchPlateText = (pattern: string, row: CarNumberLot) => {
  const raw = `${row.plate.firstLetter}${row.plate.firstDigit}${row.plate.secondDigit}${row.plate.thirdDigit}${row.plate.secondLetter}${row.plate.thirdLetter}`;

  return pattern.split("").every((char, idx) => char === "*" || char === raw[idx]);
};

const matchesTextQuery = (query: PlateSelectValue, row: CarNumberLot) => {
  if (!hasAnyChar(query.text)) return true;
  return matchPlateText(query.text, row);
};

const matchesRegion = (query: PlateSelectValue, row: CarNumberLot) => {
  const normalizedRegion = query.region && query.region !== "*" ? query.region : "";
  if (!normalizedRegion) return true;
  return String(row.plate.regionId) === normalizedRegion || row.region === normalizedRegion;
};

const applyFilters = (row: CarNumberLot, filters: CarNumberLotsFiltersState) => {
  if (filters.region && !(String(row.plate.regionId) === filters.region || row.region === filters.region)) {
    return false;
  }

  if (filters.category && row.category !== filters.category) {
    return false;
  }

  if (!matchesRegion(filters.plateQuery, row)) {
    return false;
  }

  if (!matchesTextQuery(filters.plateQuery, row)) {
    return false;
  }

  return true;
};

const applySorting = (
  a: CarNumberLot,
  b: CarNumberLot,
  sortDir: CarNumberLotsFiltersState["sortDir"],
) => (sortDir === "asc" ? a.price - b.price : b.price - a.price);

export const filterCarNumberLots = (
  lots: CarNumberLot[],
  filters: CarNumberLotsFiltersState,
) => {
  const filtered = lots.filter((row) => applyFilters(row, filters));
  return filtered.sort((a, b) => applySorting(a, b, filters.sortDir));
};
