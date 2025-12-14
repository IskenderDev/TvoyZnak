import type { PlateSelectValue } from "@/features/plate-select/model/types"

export type SortDir = "asc" | "desc"
export type SortField = "date" | "price"

export interface PlateMarketFiltersState {
  region: string
  category: string
  sortField: SortField
  sortDir: SortDir
  plateQuery: PlateSelectValue
}
