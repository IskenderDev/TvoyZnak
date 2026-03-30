import type { CSSProperties } from "react"
import { LuChevronDown } from "react-icons/lu"
import { PlateMarketRow } from "./PlateMarketRow"
import type { SortDir, SortField } from "../model/types"
import type { NumberItem } from "@/entities/number/types"

const DEFAULT_COLS = "96px minmax(210px,1fr) 140px minmax(150px,1fr) 132px"

type PlateMarketTableProps = {
  rows: NumberItem[]
  sortField: SortField
  sortDir: SortDir
  onSort: (field: SortField) => void
  className?: string
  gridCols?: string
}

export const PlateMarketTable = ({
  rows,
  sortField,
  sortDir,
  onSort,
  className = "",
  gridCols = DEFAULT_COLS,
}: PlateMarketTableProps) => {
  const style = { "--cols": gridCols } as CSSProperties
  const isDateSorted = sortField === "date"
  const isPriceSorted = sortField === "price"

  return (
    <div className={`overflow-hidden rounded-2xl bg-white text-black ${className}`}>
      <div
        className="grid items-center gap-3 border-b text-black/65 border-black/10 px-4 py-3 text-sm font-light [grid-template-columns:var(--cols)] text-center min-[1100px]:gap-4 min-[1100px]:px-6 min-[1100px]:text-lg"
        style={style}
      >
        <button
          type="button"
          onClick={() => onSort("date")}
          className="mx-auto flex items-center gap-1 tabular-nums "
          title="Сортировать по дате"
        >
          Дата
          <LuChevronDown
            className={`h-4 w-4 transition ${
              sortDir === "desc" && isDateSorted ? "rotate-180" : ""
            } ${isDateSorted ? "opacity-100" : "opacity-30"}`}
          />
        </button>
        <span>Номер</span>

        <button
          type="button"
          onClick={() => onSort("price")}
          className="mx-auto flex items-center gap-1 tabular-nums"
          title="Сортировать по цене"
        >
          Цена
          <LuChevronDown
            className={`h-4 w-4 transition ${
              sortDir === "desc" && isPriceSorted ? "rotate-180" : ""
            } ${isPriceSorted ? "opacity-100" : "opacity-30"}`}
          />
        </button>

        <span>Продавец</span>

        <div />
      </div>

      <ul className="divide-y divide-black/10">
        {rows.map((row) => (
          <PlateMarketRow key={row.id} row={row} gridCols={gridCols} />
        ))}
      </ul>
    </div>
  )
}
