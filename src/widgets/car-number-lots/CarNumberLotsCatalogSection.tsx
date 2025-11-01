import Seo from "@/shared/components/Seo";
import {
  CarNumberLotsFilters,
  CarNumberLotsMobileList,
  CarNumberLotsTable,
  useCarNumberLotsMarket,
} from "@/features/car-number-lots";

const GRID_COLS = "140px minmax(260px,1fr) 200px minmax(240px,1fr) 200px";

export default function CarNumberLotsCatalogSection() {
  const {
    loading,
    error,
    region,
    category,
    plateQuery,
    sortDir,
    regionOptions,
    categoryOptions,
    visibleRows,
    canShowMore,
    setRegion,
    setCategory,
    setPlateQuery,
    toggleSortDir,
    resetFilters,
    showMore,
  } = useCarNumberLotsMarket(12);

  return (
    <>
      <Seo title="Номера — Знак отличия" description="Каталог автомобильных номеров с актуальными предложениями." />
      <section className="bg-[#0B0B0C] text-white min-h-screen py-12">
        <div className="mx-auto px-4 sm:px-6">
          <h1 className="mb-6 text-3xl font-actay-wide uppercase md:text-4xl">Номера</h1>

          <CarNumberLotsFilters
            className="mb-6"
            region={region}
            category={category}
            plateQuery={plateQuery}
            regionOptions={regionOptions}
            categoryOptions={categoryOptions}
            onRegionChange={setRegion}
            onCategoryChange={setCategory}
            onPlateQueryChange={setPlateQuery}
          />

          {error && <p className="mb-4 rounded-xl bg-[#1E1E1E] px-4 py-3 text-[#FF6B6B]">{error}</p>}
          {loading && <p className="mb-4 text-neutral-300">Загрузка предложений...</p>}

          {!loading && !visibleRows.length && !error ? (
            <p className="rounded-xl bg-[#1E1E1E] px-6 py-10 text-center text-neutral-300">
              Номера не найдены. Измените фильтры.
            </p>
          ) : (
            <>
              <CarNumberLotsTable
                className="hidden md:block"
                rows={visibleRows}
                sortDir={sortDir}
                gridCols={GRID_COLS}
                onToggleSort={toggleSortDir}
                onReset={resetFilters}
              />

              <CarNumberLotsMobileList className="mt-6 md:hidden" rows={visibleRows} />

              {canShowMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={showMore}
                    className="rounded-full border border-black/20 bg-white px-6 py-2 text-black hover:bg-white/90"
                  >
                    Показать ещё
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
