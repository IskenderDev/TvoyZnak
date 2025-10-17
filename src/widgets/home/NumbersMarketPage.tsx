import { useMemo, useState } from "react";
import UiSelect from "@/shared/components/UiSelect";
import PlateMarketRow from "@/shared/components/plate/PlateMarketRow";
import MobilePlateCard from "@/shared/components/plate/MobilePlateCard";
import { PLATES } from "@/data/plates";
import { REGION_OPTS, CATEGORY_OPTS } from "@/data/filters";
import { LuChevronDown } from "react-icons/lu";
import PlateSelectForm320 from "@/shared/components/plate/PlateSelectForm320";

type SortDir = "asc" | "desc";

const COLS = "120px minmax(230px,1fr) 180px minmax(220px,1fr) 180px";

export default function NumbersMarketPage() {
  // Значение '' означает "Все"
  const [region, setRegion] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [limit, setLimit] = useState(8);

  // Добавляем в начало пункт "Все ..."
  const REGION_OPTS_ALL = useMemo(
    () => [{ label: "Все регионы", value: "" }, ...REGION_OPTS],
    []
  );
  const CATEGORY_OPTS_ALL = useMemo(
    () => [{ label: "Все категории", value: "" }, ...CATEGORY_OPTS],
    []
  );

  const filtered = useMemo(() => {
    let arr = [...PLATES];
    if (region) arr = arr.filter((r) => String(r.region) === region);
    if (category) arr = arr.filter((r) => r.category === category);
    arr.sort((a, b) => (sortDir === "asc" ? a.price - b.price : b.price - a.price));
    return arr;
  }, [region, category, sortDir]);

  const reset = () => {
    setRegion("");     // сбрасываем на "Все регионы"
    setCategory("");   // сбрасываем на "Все категории"
    setSortDir("asc");
  };

  return (
    <section className="min-h-screen bg-[#0B0B0C] py-10 text-white">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <UiSelect
              name="region"
              value={region}
              onChange={(v) => setRegion(v)}
              placeholder="Регионы"
              options={REGION_OPTS_ALL}
              className="min-w-[150px] text-sm md:text-2xl rounded-full bg-[#0177FF] px-4 py-2 text-white shadow-sm"
            />
            <UiSelect
              name="category"
              value={category}
              onChange={(v) => setCategory(v)}
              placeholder="Категория"
              options={CATEGORY_OPTS_ALL}
              className="min-w-[200px] text-sm md:text-2xl rounded-full bg-[#0177FF] px-4 py-2 text-white shadow-sm"
            />
          </div>

          <div className="mx-auto md:ml-auto md:mx-0">
            <PlateSelectForm320 />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl bg-white text-black hidden md:block">
          <div
            className="font-actay-druk font-bold grid items-center gap-4 border-b border-black/10 px-6 py-3 text-lg [grid-template-columns:var(--cols)] text-center"
            style={{ ["--cols" as any]: COLS }}
          >
            <span>Дата</span>
            <span>Номер</span>

            <button
              type="button"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="mx-auto flex items-center gap-1 tabular-nums"
              title="Сортировать по цене"
            >
              Цена
              <LuChevronDown className={`h-4 w-4 transition ${sortDir === "desc" ? "rotate-180" : ""}`} />
            </button>

            <span>Продавец</span>

            <div>
              <button
                onClick={reset}
                className="rounded-full border border-black/20 px-4 py-1.5 text-lg font-medium hover:bg:black/5 -mr-4"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>

          <ul className="divide-y divide-black/10">
            {filtered.slice(0, limit).map((row) => (
              <PlateMarketRow key={row.id} row={row} gridCols={COLS} />
            ))}
          </ul>
        </div>

        <ul className="mt-6 grid gap-3 md:hidden">
          {filtered.slice(0, limit).map((row) => (
            <MobilePlateCard key={row.id} row={row} />
          ))}
        </ul>

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
  );
}
