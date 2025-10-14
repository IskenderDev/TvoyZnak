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
    <li className="border-b border-white/10 px-4 py-4 last:border-b-0">
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <PlateStaticSm data={data} responsive className="max-w-[160px]" showCaption={false} />
          <span className="shrink-0 text-xs text-white/70">{row.date}</span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="text-sm">
            <span className="block font-medium">{formatPrice(row.price)}</span>
            <span className="mt-1 block text-white/80">{row.seller}</span>
          </div>

          <button className="shrink-0 rounded-full bg-[#0177FF] px-5 py-2 text-sm font-medium text-white hover:brightness-95">
            Купить
          </button>
        </div>
      </div>

      <div className="hidden grid-cols-[120px_minmax(160px,1fr)_minmax(190px,1fr)_minmax(220px,1fr)_120px] items-center gap-4 md:grid">
        <span className="text-xs text-white/70">{row.date}</span>

        <div className="flex items-center">
          <PlateStaticSm data={data} responsive className="max-w-[180px]" showCaption={false} />
        </div>

        <div className="text-sm">
          <span className="font-medium">{formatPrice(row.price)}</span>
        </div>

        <div className="text-sm text-white/80">{row.seller}</div>

        <div className="flex justify-end">
          <button className="rounded-full bg-[#0177FF] px-5 py-2 text-sm font-medium text-white hover:brightness-95">
            Купить
          </button>
        </div>
      </div>
    </li>
  )
}
