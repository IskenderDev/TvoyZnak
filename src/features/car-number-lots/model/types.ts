import type { PlateSelectValue } from "@/features/plate-select/model/types"

export type SortDir = "asc" | "desc"

export interface CarNumberLotsFiltersState {
  region: string;
  category: string;
  sortDir: SortDir;
  plateQuery: PlateSelectValue;
}
