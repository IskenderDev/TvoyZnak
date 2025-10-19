// shared/components/plate/MobilePlateCard.tsx
import { Link } from "react-router-dom";
import PlateStaticSm, { type PlateData } from "@/shared/components/plate/PlateStaticSm";
import type { NumberItem } from "@/entities/number/types";

type PlateLike = Partial<PlateData> & {
  region?: string | number;
  regionId?: number;
};

type PlateRowLike = Partial<NumberItem> & {
  createdAt?: string;
  owner?: string;
  ownerName?: string;
  user?: string;
  data?: PlateLike;
  plateData?: PlateLike;
  plate?: PlateLike;
};

type Props = {
  row: PlateRowLike;
  ctaText?: string;
  onBuy?: (row: PlateRowLike) => void;
  detailsHref?: string;
  className?: string;
};

export default function MobilePlateCard({ row, ctaText = "Купить", onBuy, detailsHref, className = "" }: Props) {
  const plate: PlateData = pickPlate(row);
  const date = fmtDate(row.date || row.createdAt);
  const price = fmtPrice(row.price);
  const seller = row.seller || row.owner || row.ownerName || row.user || "Продавец";

  return (
    <li className={`rounded-2xl bg-white p-3 text-black shadow-sm ${className}`}>
      {/* верх: номер + дата */}
      <div className="flex items-start justify-between gap-3">
        {detailsHref ? (
          <Link to={detailsHref} className="block w-[160px] shrink-0 transition hover:opacity-90">
            <PlateStaticSm data={plate} responsive className="w-full" />
          </Link>
        ) : (
          <PlateStaticSm data={plate} responsive className="w-[160px] shrink-0" />
        )}
        {date && <span className="text-xs text-black/50">{date}</span>}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold tabular-nums font-actay-druk  leading-tight">{price}</div>
          <div className="text-xs text-black/70 truncate">{seller}</div>
        </div>

        <button className="shrink-0 rounded-full bg-[#0177FF] px-4 py-2 text-white" onClick={() => onBuy?.(row)}>
          {ctaText}
        </button>
      </div>

      {detailsHref && (
        <Link
          to={detailsHref}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#0177FF] hover:underline"
        >
          Подробнее
        </Link>
      )}
    </li>
  );
}


function pickPlate(row: PlateRowLike): PlateData {
  const src = (row.plate as PlateLike | undefined) ?? row.data ?? row.plateData ?? {};
  return {
    price: src.price ?? row.price ?? 0,
    comment: src.comment ?? (typeof row.description === "string" ? row.description : ""),
    firstLetter: ensureChar(src.firstLetter ?? row.plate?.firstLetter),
    firstDigit: ensureChar(src.firstDigit ?? row.plate?.firstDigit),
    secondDigit: ensureChar(src.secondDigit ?? row.plate?.secondDigit),
    thirdDigit: ensureChar(src.thirdDigit ?? row.plate?.thirdDigit),
    secondLetter: ensureChar(src.secondLetter ?? row.plate?.secondLetter),
    thirdLetter: ensureChar(src.thirdLetter ?? row.plate?.thirdLetter),
    regionId: Number(src.regionId ?? src.region ?? row.plate?.regionId ?? row.region ?? 0) || 0,
  };
}

function ensureChar(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim().slice(0, 1);
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value).slice(0, 1);
  }
  return "*";
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
