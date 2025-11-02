import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useCarNumberLots } from "@/features/car-number-lots/hooks/useCarNumberLots";
import { CarNumberLotCard } from "@/features/car-number-lots/components/CarNumberLotCard";
import { usePagination } from "@/shared/hooks/usePagination";
import { paths } from "@/shared/routes/paths";

export function CarNumberLotsListPage() {
  const { items, fetchLots, loading, total } = useCarNumberLots();
  const { page, limit, next, prev } = usePagination();

  useEffect(() => {
    fetchLots({ page, limit });
  }, [fetchLots, limit, page]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Каталог номеров</h1>
          <p className="text-sm text-zinc-400">
            Свежие объявления по продаже автомобильных номеров
          </p>
        </div>
        <Link
          to={paths.carNumberLots.create}
          className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-emerald-400"
        >
          Разместить объявление
        </Link>
      </header>

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="animate-pulse text-sm text-zinc-400">Загрузка...</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((lot) => (
            <CarNumberLotCard key={lot.id} lot={lot} />
          ))}
        </div>
      )}

      <footer className="flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={page === 1}
          onClick={prev}
          className="rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Назад
        </button>
        <span className="text-sm text-zinc-400">
          Страница {page} из {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={next}
          className="rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Вперед
        </button>
      </footer>
    </section>
  );
}

export default CarNumberLotsListPage;
