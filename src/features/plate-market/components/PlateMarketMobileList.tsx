import MobilePlateCard from "@/shared/components/plate/MobilePlateCard"
import type { NumberItem } from "@/entities/number/types"

type PlateMarketMobileListProps = {
  rows: NumberItem[]
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
