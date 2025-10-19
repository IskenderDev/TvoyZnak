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
          className="min-w-[150px] rounded-full bg-primary-500 px-4 py-2 text-sm text-primary-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary-300 md:text-2xl"
        />
        <UiSelect
          name="category"
          value={category}
          onChange={onCategoryChange}
          placeholder="Категория"
          options={categoryOptions}
          className="min-w-[200px] rounded-full bg-primary-500 px-4 py-2 text-sm text-primary-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary-300 md:text-2xl"
        />
      </div>

      <div className="mx-auto md:ml-auto md:mx-0">
        <PlateSelectForm320 value={plateQuery} onChange={onPlateQueryChange} />
      </div>
    </div>
  )
}
