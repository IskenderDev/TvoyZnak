import type { PlateRow } from "@/app/data/plates"
import MobilePlateCard from "@/shared/components/plate/MobilePlateCard"

type PlateMarketMobileListProps = {
  rows: PlateRow[]
  className?: string
}

export const PlateMarketMobileList = ({ rows, className = "" }: PlateMarketMobileListProps) => {
  if (!rows.length) {
    return null
  }

  return (
    <ul className={`grid gap-3 ${className}`}>
      {rows.map((row) => (
        <MobilePlateCard key={row.id} row={row} />
      ))}
    </ul>
  )
}
