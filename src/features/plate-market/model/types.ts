import type { PlateSelectValue } from "@/shared/components/plate/PlateSelectForm"

export type SortDir = "asc" | "desc"

export interface PlateMarketFiltersState {
  region: string
  category: string
  sortDir: SortDir
  plateQuery: PlateSelectValue
}
