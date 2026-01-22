import { LuFilter, LuMapPin, LuTrash2 } from "react-icons/lu"
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
  onReset?: () => void
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
    <div className={`mx-auto flex w-full max-w-[820px] flex-col gap-4 ${className}`}>
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-6">
        <PlateSelectForm320 value={plateQuery} onChange={onPlateQueryChange} className="mx-auto" />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-white/10 bg-white/5 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-3">
        <div className="relative flex-1 min-w-[220px]">
          <LuMapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <UiSelect
            name="region"
            value={region}
            onChange={onRegionChange}
            placeholder="Все регионы"
            options={regionOptions}
            dropdownWidth="content"
            minContentWidth={240}
            maxContentWidth={360}
            className="w-full rounded-full border border-white/20 bg-white/10 px-11 py-2.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition duration-150 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:text-base"
            valueClassName="text-white"
            placeholderClassName="text-white/70"
          />
        </div>

        <div className="relative flex-1 min-w-[220px]">
          <LuFilter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <UiSelect
            name="category"
            value={category}
            onChange={onCategoryChange}
            placeholder="Все категории"
            options={categoryOptions}
            dropdownWidth="content"
            minContentWidth={240}
            maxContentWidth={360}
            className="w-full rounded-full border border-white/20 bg-white/10 px-11 py-2.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition duration-150 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:text-base"
            valueClassName="text-white"
            placeholderClassName="text-white/70"
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition duration-150 hover:border-white/40 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:w-auto md:text-base"
        >
          <LuTrash2 className="h-4 w-4" />
          Сбросить
        </button>
      </div>
    </div>
  )
}
