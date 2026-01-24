import type { CSSProperties } from "react"
import { LuChevronDown } from "react-icons/lu"
import { PlateMarketRow } from "./PlateMarketRow"
import type { SortDir, SortField } from "../model/types"
import type { NumberItem } from "@/entities/number/types"

const DEFAULT_COLS = "120px minmax(230px,1fr) 180px minmax(220px,1fr) 180px"

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
        className="grid items-center gap-4 border-b border-black/10 px-6 py-3 text-lg font-bold [grid-template-columns:var(--cols)] text-center"
        style={style}
      >
        <button
          type="button"
          onClick={() => onSort("date")}
          className="mx-auto flex items-center gap-1 tabular-nums"
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
