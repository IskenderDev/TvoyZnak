import type { CSSProperties } from "react";
import { LuChevronDown } from "react-icons/lu";
import { CarNumberLotRow } from "./CarNumberLotRow";
import type { SortDir } from "../model/types";
import type { CarNumberLot } from "@/entities/car-number-lot/types";

const DEFAULT_COLS = "120px minmax(230px,1fr) 180px minmax(220px,1fr) 180px";

type CarNumberLotsTableProps = {
  rows: CarNumberLot[];
  sortDir: SortDir;
  onToggleSort: () => void;
  onReset: () => void;
  className?: string;
  gridCols?: string;
};

export const CarNumberLotsTable = ({
  rows,
  sortDir,
  onToggleSort,
  onReset,
  className = "",
  gridCols = DEFAULT_COLS,
}: CarNumberLotsTableProps) => {
  const style = { "--cols": gridCols } as CSSProperties;

  return (
    <div className={`overflow-hidden rounded-2xl bg-white text-black ${className}`}>
      <div
        className="font-actay-druk font-bold grid items-center gap-4 border-b border-black/10 px-6 py-3 text-lg [grid-template-columns:var(--cols)] text-center"
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
            className="-mr-4 rounded-full border border-black/20 px-4 py-1.5 text-lg font-medium hover:bg-black/5"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      <ul className="divide-y divide-black/10">
        {rows.map((row) => (
          <CarNumberLotRow key={row.id} row={row} gridCols={gridCols} />
        ))}
      </ul>
    </div>
  );
};
