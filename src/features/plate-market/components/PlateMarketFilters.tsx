import { LuFilter, LuMapPin } from "react-icons/lu"
import UiSelect from "@/shared/components/UiSelect"
import PlateSelectForm320 from "@/features/plate-select/ui/PlateSelectForm320"
import type { PlateSelectValue } from "@/features/plate-select/model/types"
import { RiDeleteBin5Line } from "react-icons/ri";

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

export const  PlateMarketFilters = ({
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
      <div className="">
        <PlateSelectForm320 value={plateQuery} onChange={onPlateQueryChange} />
      </div>
      <div className="flex w-full flex-wrap items-center gap-3 rounded-4xl bg-white p-4  sm:p-6 md:p-4">
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
          className="w-[85vw] md:w-[350px] flex-1 rounded-full bg-[#eeeeee] px-4 py-2 text-sm text-black shadow-sm md:text-lg"
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
          className="w-[85vw] md:w-[350px] flex-1 rounded-full bg-[#eeeeee] px-4 py-2 text-sm text-black shadow-sm md:text-lg"
        />
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-full border border-black/20 px-4 py-2 text-sm font-medium text-black/80 transition hover:bg-black/5 sm:ml-auto sm:w-auto flex items-center justify-center gap-2 md:text-lg bg-[#eeeeee] " 
        >
          <RiDeleteBin5Line className="h-4 w-4 text-black/60 md:h-5 md:w-5" /> Сбросить 
        </button>
      </div>
    </div>
  )
}
