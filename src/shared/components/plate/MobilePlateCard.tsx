import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import PlateStaticSm, { type PlateData } from "@/shared/components/plate/PlateStaticSm";
import { formatRegionCode } from "@/shared/lib/plate";
import type { NumberItem } from "@/entities/number/types";

type PlateLike = Partial<PlateData> & {
  region?: string | number;
  regionCode?: string | number;
  regionId?: string | number | null;
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
  const price = fmtPrice((row.markupPrice ?? row.originalPrice ?? row.price));
  const seller = row.seller || row.owner || row.ownerName || row.user || "Продавец";

  const handleBuy = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onBuy?.(row);
  };

  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[11px] text-black/50 leading-tight">{date}</span>
      </div>

      <div className="mb-3">
        <PlateStaticSm data={plate} responsive className="w-full max-w-[200px]" />
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-bold tabular-nums leading-tight mb-0.5">{price}</div>
          <div className="text-xs text-black/60 truncate">{seller}</div>
        </div>

        <button 
          className="shrink-0 rounded-full bg-[#0177FF] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0166E6] active:bg-[#0155CC]" 
          onClick={handleBuy}
        >
          {ctaText}
        </button>
      </div>
    </>
  );

  return (
    <li>
      {detailsHref ? (
        <Link
          to={detailsHref}
          className={`block rounded-2xl bg-white p-4 text-black shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#0177FF] ${className}`}
        >
          {cardContent}
        </Link>
      ) : (
        <div className={`rounded-2xl bg-white p-4 text-black shadow-sm ${className}`}>
          {cardContent}
        </div>
      )}
    </li>
  );
}


function pickPlate(row: PlateRowLike): PlateData {
  const src = (row.plate as PlateLike | undefined) ?? row.data ?? row.plateData ?? {};
  return {
    price: src.price ?? row.markupPrice ?? row.originalPrice ?? row.price ?? 0,
    comment: "",
    firstLetter: ensureChar(src.firstLetter ?? row.plate?.firstLetter),
    firstDigit: ensureChar(src.firstDigit ?? row.plate?.firstDigit),
    secondDigit: ensureChar(src.secondDigit ?? row.plate?.secondDigit),
    thirdDigit: ensureChar(src.thirdDigit ?? row.plate?.thirdDigit),
    secondLetter: ensureChar(src.secondLetter ?? row.plate?.secondLetter),
    thirdLetter: ensureChar(src.thirdLetter ?? row.plate?.thirdLetter),
    regionId: formatRegionCode(
      row.plate?.regionCode ?? src.regionCode ?? src.region ?? row.region ?? "",
    ),
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
  return `${new Intl.NumberFormat("ru-RU").format(n)} ₽`;
}