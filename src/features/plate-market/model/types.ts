import type { PlateSelectValue } from "@/features/plate-select/model/types"

export type SortDir = "asc" | "desc"

export interface PlateMarketFiltersState {
  region: string
  category: string
  sortDir: SortDir
  plateQuery: PlateSelectValue
}
