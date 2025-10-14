import PlateStaticSm from "@/shared/components/plate/PlateStaticSm"
import type { PlateData } from "@/shared/components/plate/PlateStaticSm"
import { formatPrice } from "@/lib/format"
import type { PlateRow } from "@/data/plates"

export default function PlateMarketRow({ row }: { row: PlateRow }) {
  const data: PlateData = {
    price: row.price,
    comment: row.plate.comment ?? "",
    firstLetter: row.plate.firstLetter,
    secondLetter: row.plate.secondLetter,
    thirdLetter: row.plate.thirdLetter,
    firstDigit: row.plate.firstDigit,
    secondDigit: row.plate.secondDigit,
    thirdDigit: row.plate.thirdDigit,
    regionId: row.plate.regionId,
  }

  return (
    <li className="grid grid-cols-[120px_minmax(160px,1fr)_minmax(190px,1fr)_minmax(220px,1fr)_120px] items-center gap-4 border-b border-white/10 px-4 py-3 last:border-b-0">
      <span className="text-xs">{row.date}</span>

      <div className="flex items-center">
        <PlateStaticSm data={data} responsive className="max-w-[180px]" showCaption={false} />
      </div>

      <div className="text-sm">
        <span className="font-medium">{formatPrice(row.price)}</span>
      </div>

      <div className="text-sm font-actay">{row.seller}</div>

      <div className="flex justify-end">
        <button className="rounded-full bg-[#0177FF] px-5 py-2 text-sm font-medium text-white hover:brightness-95">
          Купить
        </button>
      </div>
    </li>
  )
}
