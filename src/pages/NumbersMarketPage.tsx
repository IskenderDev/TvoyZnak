import { useMemo, useState } from "react"
import UiSelect from "@/shared/components/UiSelect"
import PlateStaticSm from "@/shared/components/plate/PlateStaticSm"
import PlateMarketRow from "@/components/PlateMarketRow"
import { PLATES } from "@/data/plates"
import { REGION_OPTS, CATEGORY_OPTS } from "@/data/filters"
import type { PlateData } from "@/shared/components/plate/PlateStaticSm"
import { LuChevronDown } from "react-icons/lu"

type SortDir = "asc" | "desc"

export default function NumbersMarketPage() {

  const [region, setRegion] = useState<(typeof REGION_OPTS)[number]["value"]>(REGION_OPTS[0].value)
  const [category, setCategory] = useState<(typeof CATEGORY_OPTS)[number]["value"]>(CATEGORY_OPTS[0].value)
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [limit, setLimit] = useState(8)

  const filtered = useMemo(() => {
    let arr = [...PLATES]
    if (region) arr = arr.filter((r) => String(r.region) === region)
    if (category) arr = arr.filter((r) => r.category === category)
    arr.sort((a, b) => (sortDir === "asc" ? a.price - b.price : b.price - a.price))
    return arr
  }, [region, category, sortDir])

  const reset = () => {
    setRegion(REGION_OPTS[0].value)
    setCategory(CATEGORY_OPTS[0].value)
    setSortDir("asc")
  }

  const starPlate: PlateData = {
    price: 0,
    comment: "",
    firstLetter: "*",
    firstDigit: "*",
    secondDigit: "*",
    thirdDigit: "*",
    secondLetter: "*",
    thirdLetter: "*",
    regionId: 0,
  }

  return (
    <section className="min-h-screen bg-[#0B0B0C] py-10 text-white">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <UiSelect
              name="region"
              value={region}
              onChange={(v) => setRegion(v)}
              placeholder="Регионы"
              options={REGION_OPTS}
              className="min-w-[150px] rounded-full bg-white px-4 py-2 text-black shadow-sm"
            />
            <UiSelect
              name="category"
              value={category}
              onChange={(v) => setCategory(v)}
              placeholder="Категория"
              options={CATEGORY_OPTS}
              className="min-w-[200px] rounded-full bg-white px-4 py-2 text-black shadow-sm"
            />
          </div>

          <div className="rounded-lg border border-black/20 bg-white px-3 py-2">
            <PlateStaticSm data={starPlate} responsive className="max-w-[210px]" />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl bg-white text-black">
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
            <div className="grid w-full grid-cols-[120px_minmax(160px,1fr)_minmax(190px,1fr)_minmax(220px,1fr)_120px] text-xs font-medium text-black/60">
              <span>Дата</span>
              <span>Номер</span>
              <button
                type="button"
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                className="flex items-center gap-1 text-left"
                title="Сортировать по цене"
              >
                Цена
                <LuChevronDown className={`transition ${sortDir === "desc" ? "rotate-180" : ""}`} />
              </button>
              <span>Продавец</span>
              <span className="text-right"> </span>
            </div>

            <button
              onClick={reset}
              className="ml-4 rounded-full border border-black/20 px-3 py-1.5 text-sm hover:bg-black/5"
            >
              Сбросить фильтры
            </button>
          </div>

          <ul>
            {filtered.slice(0, limit).map((row) => (
              <PlateMarketRow key={row.id} row={row} />
            ))}
          </ul>
        </div>

        {limit < filtered.length && (
          <div className="flex justify-center">
            <button
              onClick={() => setLimit((l) => l + 8)}
              className="mt-6 rounded-full border border-black/20 bg-white px-6 py-2 text-black hover:bg-white/90"
            >
              Показать ещё
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
