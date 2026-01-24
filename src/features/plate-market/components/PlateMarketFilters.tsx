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
    <div className={`flex flex-col flex-wrap items-center justify-center gap-4 ${className}`}>
      <div className="mx-auto">
        <PlateSelectForm320 value={plateQuery} onChange={onPlateQueryChange} />
      </div>
      <div className="flex flex-wrap gap-3 bg-white px-20 py-5 rounded-3xl">
        <UiSelect
          name="region"
          value={region}
          onChange={onRegionChange}
          placeholder="Регионы"
          options={regionOptions}
          dropdownWidth="content"
          minContentWidth={300}
          maxContentWidth={400}
          className="w-[90vw] md:w-[350px] text-sm md:text-xl rounded-full bg-[#eeeeee] px-4 py-2 text-black shadow-sm flex justify-center"
        />
        <UiSelect
          name="category"
          value={category}
          onChange={onCategoryChange}
          placeholder="Категория"
          options={categoryOptions}
          dropdownWidth="content"
          minContentWidth={300}
          maxContentWidth={400}
          className="w-[90vw] md:w-[350px] text-sm md:text-xl rounded-full bg-[#eeeeee] px-4 py-2 text-black shadow-sm flex justify-center"
        />

      </div>


    </div>
  )
}
