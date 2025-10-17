import PlateStaticSm from "./PlateStaticSm";
import { formatPrice } from "@/lib/format";
import type { PlateRow, PlateView } from "../model/types";

export default function PlateMarketRow({
  row,
  gridCols,
}: {
  row: PlateRow;
  gridCols: string;
}) {
  const data: PlateView = {
    price: row.price,
    comment: row.plate.comment ?? "",
    firstLetter: row.plate.firstLetter,
    secondLetter: row.plate.secondLetter,
    thirdLetter: row.plate.thirdLetter,
    firstDigit: row.plate.firstDigit,
    secondDigit: row.plate.secondDigit,
    thirdDigit: row.plate.thirdDigit,
    regionId: row.plate.regionId,
  };

  return (
    <li
      className="grid font-actay items-center gap-4 px-6 py-4 [grid-template-columns:var(--cols)] text-center"
      style={{ ["--cols" as any]: gridCols }}
    >
      <time className="text-sm md:text-lg tabular-nums text-black">{row.date}</time>

      <div className="flex items-center">
        <PlateStaticSm
          data={data}
          responsive
          showCaption={false}
          className="max-w-[210px] mx-auto"
        />
      </div>

      <div className="tabular-nums text-sm md:text-lg">
        <span className="font-medium">{formatPrice(row.price)}</span>
      </div>

      <div className="text-sm md:text-lg font-actay">{row.seller}</div>

      <div className="justify-self-end">
        <button className="rounded-full bg-[#0177FF] px-5 py-2 text-sm md:text-lg font-medium text-white hover:brightness-95">
          Купить
        </button>
      </div>
    </li>
  );
}
