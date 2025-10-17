import type { PlateSelectValue } from "@/features/plate-select/ui/PlateSelectForm"

export type SortDir = "asc" | "desc"

export interface PlateMarketFiltersState {
  region: string
  category: string
  sortDir: SortDir
  plateQuery: PlateSelectValue
}
