import UiSelect from "@/shared/components/UiSelect"
import PlateSelectForm320 from "@/features/plate-select/ui/PlateSelectForm320"
import type { PlateSelectValue } from "@/features/plate-select/model/types"

export type SelectOption = { label: string; value: string }

type PlateMarketFiltersProps = {
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

export const PlateMarketFilters = ({
  region,
  category,
  plateQuery,
  regionOptions,
  categoryOptions,
  onRegionChange,
  onCategoryChange,
  onPlateQueryChange,
  className = "",
}: PlateMarketFiltersProps) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-wrap gap-3">
        <UiSelect
          name="region"
          value={region}
          onChange={onRegionChange}
          placeholder="Регионы"
          options={regionOptions}
          className="w-[240px] md:w-[380px] text-sm md:text-xl rounded-full bg-[#0177FF] px-4 py-2 text-white shadow-sm flex justify-center"
        />
        <UiSelect
          name="category"
          value={category}
          onChange={onCategoryChange}
          placeholder="Категория"
          options={categoryOptions}
          className="w-[200px] md:w-[290px] text-center text-sm md:text-xl rounded-full bg-[#0177FF] px-4 py-2 text-white shadow-sm flex justify-center"
        />
      </div>

      <div className="mx-auto md:ml-auto md:mx-0">
        <PlateSelectForm320 value={plateQuery} onChange={onPlateQueryChange} />
      </div>
    </div>
  )
}
