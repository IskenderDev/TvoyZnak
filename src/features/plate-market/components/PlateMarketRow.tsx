import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
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
    price: row.price,
    comment: row.plate.comment ?? row.description ?? "",
    firstLetter: row.plate.firstLetter,
    secondLetter: row.plate.secondLetter,
    thirdLetter: row.plate.thirdLetter,
    firstDigit: row.plate.firstDigit,
    secondDigit: row.plate.secondDigit,
    thirdDigit: row.plate.thirdDigit,
    regionId: row.plate.regionId,
  };

  const style = { "--cols": gridCols } as CSSProperties;
  const navigate = useNavigate();
  const detailsPath = paths.numberDetails(row.id);
  const priceLabel = formatPrice(row.price);
  const contactPrefill = buildContactPrefill(row);
  const contactSearch = createSearchParams({
    ...(contactPrefill.carNumber ? { carNumber: contactPrefill.carNumber } : {}),
    feedbackType: contactPrefill.feedbackType,
  }).toString();

  const handleOpenDetails = () => {
    if (typeof window !== "undefined") {
      window.open(detailsPath, "_blank", "noopener,noreferrer");
      return;
    }

    navigate(detailsPath);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenDetails();
    }
  };

  const handleBuyClick = (event: MouseEvent<HTMLButtonElement>) => {
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
    <li
      role="link"
      tabIndex={0}
      onClick={handleOpenDetails}
      onKeyDown={handleKeyDown}
      className="grid cursor-pointer items-center gap-4 px-6 py-4 text-center font-actay transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0177FF] [grid-template-columns:var(--cols)]"
      style={style}
      aria-label={`Подробнее о номере ${formatPlateLabel(row)}`}
    >
      <time className="tabular-nums text-sm text-black md:text-lg">
        {row.date ? formatDate(row.date) : "—"}
      </time>

      <div className="flex items-center">
        <PlateStaticSm data={data} responsive showCaption={true} className="mx-auto max-w-[210px]" />
      </div>

      <div className="tabular-nums text-sm md:text-lg font-actay">
        <span className="font-medium font-actay-druk">{priceLabel}</span>
      </div>

      <div className="text-sm font-actay md:text-lg">{row.seller}</div>

      <div className="justify-self-end">
        <button
          onClick={handleBuyClick}
          className="rounded-full bg-[#0177FF] px-5 py-2 text-sm font-medium text-white transition hover:brightness-95 md:text-lg"
        >
          Купить
        </button>
      </div>
    </li>
  );
};
