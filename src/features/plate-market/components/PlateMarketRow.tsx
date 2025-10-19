import type { CSSProperties } from "react";
import PlateStaticSm from "@/shared/components/plate/PlateStaticSm";
import type { PlateData } from "@/shared/components/plate/PlateStaticSm";
import { formatPrice } from "@/shared/lib/format";
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

  return (
    <li className="grid items-center gap-4 px-6 py-4 text-center font-actay [grid-template-columns:var(--cols)]" style={style}>
      <time className="tabular-nums text-sm text-black md:text-lg">
        {row.date ? formatDate(row.date) : "—"}
      </time>

      <div className="flex items-center">
        <PlateStaticSm data={data} responsive showCaption={false} className="mx-auto max-w-[210px]" />
      </div>

      <div className="tabular-nums text-sm md:text-lg font-actay">
        <span className="font-medium font-actay-druk">{formatPrice(row.price)}</span>
      </div>

      <div className="text-sm font-actay md:text-lg">{row.seller}</div>

      <div className="justify-self-end">
        <button className="rounded-full bg-[#0177FF] px-5 py-2 text-sm font-medium text-white hover:brightness-95 md:text-lg">
          Купить
        </button>
      </div>
    </li>
  );
};
