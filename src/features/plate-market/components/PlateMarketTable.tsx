import type { CSSProperties } from "react"
import { LuChevronDown } from "react-icons/lu"
import { PlateMarketRow } from "./PlateMarketRow"
import type { SortDir } from "../model/types"
import type { NumberItem } from "@/entities/number/types"

const DEFAULT_COLS = "120px minmax(230px,1fr) 180px minmax(220px,1fr) 180px"

type PlateMarketTableProps = {
  rows: NumberItem[]
  sortDir: SortDir
  onToggleSort: () => void
  onReset: () => void
  className?: string
  gridCols?: string
}

export const PlateMarketTable = ({
  rows,
  sortDir,
  onToggleSort,
  onReset,
  className = "",
  gridCols = DEFAULT_COLS,
}: PlateMarketTableProps) => {
  const style = { "--cols": gridCols } as CSSProperties

  return (
    <div className={`overflow-hidden rounded-2xl bg-surface text-foreground ${className}`}>
      <div
        className="grid items-center gap-4 border-b border-border/30 px-6 py-3 text-center font-actay-druk text-lg font-bold [grid-template-columns:var(--cols)]"
        style={style}
      >
        <span>Дата</span>
        <span>Номер</span>

        <button
          type="button"
          onClick={onToggleSort}
          className="mx-auto flex items-center gap-1 tabular-nums"
          title="Сортировать по цене"
        >
          Цена
          <LuChevronDown className={`h-4 w-4 transition ${sortDir === "desc" ? "rotate-180" : ""}`} />
        </button>

        <span>Продавец</span>

        <div>
          <button
            onClick={onReset}
            className="-mr-4 rounded-full border border-border/40 px-4 py-1.5 text-lg font-medium transition hover:bg-foreground/5"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      <ul className="divide-y divide-border/30">
        {rows.map((row) => (
          <PlateMarketRow key={row.id} row={row} gridCols={gridCols} />
        ))}
      </ul>
    </div>
  )
}
