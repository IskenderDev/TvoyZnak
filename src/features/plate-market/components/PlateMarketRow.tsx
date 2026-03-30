import type { CSSProperties, MouseEvent } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import PlateStaticSm from "@/shared/components/plate/PlateStaticSm";
import type { PlateData } from "@/shared/components/plate/PlateStaticSm";
import { formatPrice } from "@/shared/lib/format";
import { buildContactPrefill, formatPlateLabel } from "@/shared/lib/plate";
import { paths } from "@/shared/routes/paths";
import type { NumberItem } from "@/entities/number/types";

type PlateMarketRowProps = {
  row: NumberItem;
  gridCols: string;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(+date)) return "";
  return date.toLocaleDateString("ru-RU");
};

export const PlateMarketRow = ({ row, gridCols }: PlateMarketRowProps) => {
  const data: PlateData = {
    price: row.markupPrice ?? row.originalPrice,
    comment: "",
    firstLetter: row.plate.firstLetter,
    secondLetter: row.plate.secondLetter,
    thirdLetter: row.plate.thirdLetter,
    firstDigit: row.plate.firstDigit,
    secondDigit: row.plate.secondDigit,
    thirdDigit: row.plate.thirdDigit,
    regionId: row.plate.regionCode || row.region,
  };

  const style = { "--cols": gridCols } as CSSProperties;
  const navigate = useNavigate();
  const detailsPath = paths.numberDetails(row.id);
  const priceLabel = formatPrice(row.markupPrice ?? row.originalPrice);
  const contactPrefill = buildContactPrefill(row);
  const contactSearch = createSearchParams({
    ...(contactPrefill.carNumber ? { carNumber: contactPrefill.carNumber } : {}),
    feedbackType: contactPrefill.feedbackType,
  }).toString();

  const handleBuyClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(
      {
        pathname: paths.contacts,
        search: contactSearch ? `?${contactSearch}` : "",
      },
      { state: { leadPrefill: contactPrefill } },
    );
  };

  return (
    <li>
      <Link
        to={detailsPath}
        className="grid cursor-pointer items-center gap-3 px-4 py-4 text-center transition hover:bg-black/5 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#0177FF] [grid-template-columns:var(--cols)] min-[1100px]:gap-4 min-[1100px]:px-6"
        style={style}
        aria-label={`Подробнее о номере ${formatPlateLabel(row)}`}
      >
        <time className="tabular-nums text-xs font-light text-black/65 min-[1100px]:text-lg">
          {row.date ? formatDate(row.date) : "—"}
        </time>

        <div className="flex items-center">
          <PlateStaticSm data={data} responsive className="mx-auto max-w-[180px] min-[1100px]:max-w-[210px]" />
        </div>

        <div className="tabular-nums w-[140px] text-sm min-[1100px]:w-[200px] min-[1100px]:text-lg">
          <span className="font-[400]">{priceLabel}</span>
        </div>

        <div className="truncate text-sm font-light text-black/65 min-[1100px]:text-lg">{row.seller}</div>

        <div className="justify-self-end">
          <button
            onClick={handleBuyClick}
            className="rounded-full bg-[#0177FF] px-3 py-2 text-sm font-medium text-white transition hover:brightness-95 min-[1100px]:px-5 min-[1100px]:text-lg"
          >
            Купить
          </button>
        </div>
      </Link>
    </li>
  );
};
