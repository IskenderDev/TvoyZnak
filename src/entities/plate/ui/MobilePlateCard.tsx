import React from "react";
import PlateStaticSm from "./PlateStaticSm";
import type { PlateView } from "../model/types";

type Props = {
  row: any;
  ctaText?: string;
  onBuy?: (row: any) => void;
  className?: string;
};

export default function MobilePlateCard({ row, ctaText = "Купить", onBuy, className = "" }: Props) {
  const plate: PlateView = pickPlate(row);
  const date = fmtDate(row.date || row.createdAt);
  const price = fmtPrice(row.price);
  const seller = row.seller || row.owner || row.ownerName || row.user || "Продавец";

  return (
    <li className={`rounded-2xl bg-white p-3 text-black shadow-sm ${className}`}>
      {/* верх: номер + дата */}
      <div className="flex items-start justify-between gap-3">
        <PlateStaticSm data={plate} responsive className="w-[160px] shrink-0" />
        {date && <span className="text-xs text-black/50">{date}</span>}
      </div>

      {/* низ: цена/продавец + CTA */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold tabular-nums leading-tight">{price}</div>
          <div className="text-xs text-black/70 truncate">{seller}</div>
        </div>

        <button
          className="shrink-0 rounded-full bg-[#0177FF] px-4 py-2 text-white"
          onClick={() => onBuy?.(row)}
        >
          {ctaText}
        </button>
      </div>
    </li>
  );
}

/* ---------- helpers ---------- */

function pickPlate(row: any): PlateView {
  const src = row.plate || row.data || row.plateData || {};
  return {
    price: src.price ?? row.price ?? 0,
    comment: src.comment ?? "",
    firstLetter: src.firstLetter ?? src.A1 ?? row.firstLetter ?? "*",
    firstDigit: src.firstDigit ?? src.D1 ?? row.firstDigit ?? "*",
    secondDigit: src.secondDigit ?? src.D2 ?? row.secondDigit ?? "*",
    thirdDigit: src.thirdDigit ?? src.D3 ?? row.thirdDigit ?? "*",
    secondLetter: src.secondLetter ?? src.A2 ?? row.secondLetter ?? "*",
    thirdLetter: src.thirdLetter ?? src.A3 ?? row.thirdLetter ?? "*",
    regionId: Number(src.regionId ?? src.region ?? row.regionId ?? row.region ?? 0) || 0,
  };
}

function fmtDate(v?: string) {
  if (!v) return "";
  const t = new Date(v);
  return Number.isNaN(+t) ? "" : t.toLocaleDateString("ru-RU");
}

function fmtPrice(n?: number) {
  if (typeof n !== "number") return "";
  return new Intl.NumberFormat("ru-RU").format(n) + " рублей";
}
