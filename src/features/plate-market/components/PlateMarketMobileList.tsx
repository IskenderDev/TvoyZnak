import { createSearchParams, useNavigate } from "react-router-dom"
import MobilePlateCard from "@/shared/components/plate/MobilePlateCard"
import { buildContactPrefill } from "@/shared/lib/plate"
import { paths } from "@/shared/routes/paths"
import type { NumberItem } from "@/entities/number/types"

type PlateMarketMobileListProps = {
  rows: NumberItem[]
  className?: string
}

export const PlateMarketMobileList = ({ rows, className = "" }: PlateMarketMobileListProps) => {
  if (!rows.length) {
    return null
  }

  const navigate = useNavigate()

  const handleBuy = (row: NumberItem) => {
    const contactPrefill = buildContactPrefill(row)
    const search = createSearchParams({
      ...(contactPrefill.carNumber ? { carNumber: contactPrefill.carNumber } : {}),
      feedbackType: contactPrefill.feedbackType,
    }).toString()

    navigate(
      {
        pathname: paths.contacts,
        search: search ? `?${search}` : "",
      },
      { state: { leadPrefill: contactPrefill } },
    )
  }

  return (
    <ul className={`grid gap-3 ${className}`}>
      {rows.map((row) => (
        <MobilePlateCard
          key={row.id}
          row={row}
          detailsHref={paths.numberDetails(row.id)}
          onBuy={() => handleBuy(row)}
        />
      ))}
    </ul>
  )
}
