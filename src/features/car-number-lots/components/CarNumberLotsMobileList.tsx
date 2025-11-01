import { createSearchParams, useNavigate } from "react-router-dom"
import MobilePlateCard from "@/shared/components/plate/MobilePlateCard"
import { buildContactPrefill } from "@/shared/lib/plate"
import { paths } from "@/shared/routes/paths"
import type { CarNumberLot } from "@/entities/car-number-lot/types"

type CarNumberLotsMobileListProps = {
  rows: CarNumberLot[]
  className?: string
}

export const CarNumberLotsMobileList = ({ rows, className = "" }: CarNumberLotsMobileListProps) => {
  const navigate = useNavigate()

  if (!rows.length) {
    return null
  }

  const handleBuy = (row: CarNumberLot) => {
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
          detailsHref={paths.carNumberLotDetails(row.id)}
          onBuy={() => handleBuy(row)}
        />
      ))}
    </ul>
  )
}
