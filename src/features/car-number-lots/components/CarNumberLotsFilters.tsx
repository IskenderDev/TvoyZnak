import UiSelect from "@/shared/components/UiSelect"
import PlateSelectForm320 from "@/features/plate-select/ui/PlateSelectForm320"
import type { PlateSelectValue } from "@/features/plate-select/model/types"

export type SelectOption = { label: string; value: string }

type CarNumberLotsFiltersProps = {
  region: string
  category: string
  plateQuery: PlateSelectValue
  regionOptions: SelectOption[]
  categoryOptions: SelectOption[]
  onRegionChange: (region: string) => void
  onCategoryChange: (category: string) => void
  onPlateQueryChange: (value: PlateSelectValue) => void
  className?: string
}

export const CarNumberLotsFilters = ({
  region,
  category,
  plateQuery,
  regionOptions,
  categoryOptions,
  onRegionChange,
  onCategoryChange,
  onPlateQueryChange,
  className = "",
}: CarNumberLotsFiltersProps) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-wrap gap-3">
        <UiSelect
          name="region"
          value={region}
          onChange={onRegionChange}
          placeholder="Регионы"
          options={regionOptions}
          className="min-w-[150px] text-sm md:text-2xl rounded-full bg-[#0177FF] px-4 py-2 text-white shadow-sm"
        />
        <UiSelect
          name="category"
          value={category}
          onChange={onCategoryChange}
          placeholder="Категория"
          options={categoryOptions}
          className="min-w-[200px] text-sm md:text-2xl rounded-full bg-[#0177FF] px-4 py-2 text-white shadow-sm"
        />
      </div>

      <div className="mx-auto md:ml-auto md:mx-0">
        <PlateSelectForm320 value={plateQuery} onChange={onPlateQueryChange} />
      </div>
    </div>
  )
}
