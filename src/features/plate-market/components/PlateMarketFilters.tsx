import { LuFilter, LuMapPin } from "react-icons/lu"
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
  onReset: () => void
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
  onReset,
  className = "",
}: PlateMarketFiltersProps) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="mx-auto w-full max-w-4xl">
        <PlateSelectForm320 value={plateQuery} onChange={onPlateQueryChange} />
      </div>
      <div className="flex w-full max-w-5xl flex-wrap items-center gap-3 rounded-3xl bg-white px-4 py-3 sm:px-6 md:px-10">
        <UiSelect
          name="region"
          value={region}
          onChange={onRegionChange}
          placeholder="Все регионы"
          options={regionOptions}
          leadingIcon={<LuMapPin className="h-4 w-4 text-black/60 md:h-5 md:w-5" />}
          dropdownWidth="content"
          minContentWidth={300}
          maxContentWidth={400}
          className="w-full min-w-[220px] flex-1 rounded-full bg-[#eeeeee] px-4 py-2 text-sm text-black shadow-sm md:text-base"
        />
        <UiSelect
          name="category"
          value={category}
          onChange={onCategoryChange}
          placeholder="Все категории"
          options={categoryOptions}
          leadingIcon={<LuFilter className="h-4 w-4 text-black/60 md:h-5 md:w-5" />}
          dropdownWidth="content"
          minContentWidth={300}
          maxContentWidth={400}
          className="w-full min-w-[220px] flex-1 rounded-full bg-[#eeeeee] px-4 py-2 text-sm text-black shadow-sm md:text-base"
        />
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-black/80 transition hover:bg-black/5 sm:ml-auto sm:w-auto"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  )
}
