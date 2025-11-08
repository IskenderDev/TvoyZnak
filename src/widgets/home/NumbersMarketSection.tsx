import {
  PlateMarketFilters,
  PlateMarketMobileList,
  PlateMarketTable,
  usePlateMarket,
} from "@/features/plate-market";

const GRID_COLS = "120px minmax(230px,1fr) 180px minmax(220px,1fr) 180px";

export default function NumbersMarketSection() {
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
  } = usePlateMarket();

  return (
    <section className="min-h-screen bg-[#0B0B0C] py-10 text-white">
      <div className="mx-auto px-4 sm:px-6">
        <PlateMarketFilters
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

        {error && <p className="mb-4 rounded-xl bg-white px-4 py-3 text-[#FF6B6B]">{error}</p>}
        {loading && <p className="mb-4 text-neutral-300">Загрузка предложений...</p>}

        <PlateMarketTable
          className="hidden md:block"
          rows={visibleRows}
          sortDir={sortDir}
          gridCols={GRID_COLS}
          onToggleSort={toggleSortDir}
          onReset={resetFilters}
        />
        {!loading && !visibleRows.length && !error ? (
          <p className="rounded-xl md:-mt-10 bg-white px-6 py-10 pt-20 text-center text-black">
            Номера не найдены. Измените фильтры.
          </p>
        ) : (
          <>

            <PlateMarketMobileList className="mt-6 md:hidden" rows={visibleRows} />

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
  );
}
