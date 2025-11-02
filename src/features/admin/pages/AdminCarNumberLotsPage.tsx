import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { CarNumberLotTable } from "@/features/car-number-lots/components/CarNumberLotTable";
import { useAdmin } from "@/features/admin/hooks/useAdmin";
import { usePagination } from "@/shared/hooks/usePagination";
import type { CarNumberLot, CarNumberLotStatus } from "@/shared/types";

const statuses: CarNumberLotStatus[] = [
  "pending",
  "published",
  "rejected",
  "archived",
];

export function AdminCarNumberLotsPage() {
  const { lots, fetchAdminLots, loading, confirmLot, updateLot, deleteLot } = useAdmin();
  const { page, limit } = usePagination();
  const [filters, setFilters] = useState<{ status?: CarNumberLotStatus }>({});
  const [editing, setEditing] = useState<CarNumberLot | null>(null);
  const [price, setPrice] = useState<number | "">("");
  const [status, setStatus] = useState<CarNumberLotStatus | "">("");

  useEffect(() => {
    fetchAdminLots({ page, limit, status: filters.status });
  }, [fetchAdminLots, filters.status, limit, page]);

  useEffect(() => {
    if (editing) {
      setPrice(editing.price);
      setStatus(editing.status);
    } else {
      setPrice("");
      setStatus("");
    }
  }, [editing]);

  const canConfirm = useMemo(() => (lot: CarNumberLot) => lot.status === "pending", []);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Объявления</h2>
          <p className="text-sm text-zinc-400">Проверяйте, обновляйте и публикуйте объявления пользователей</p>
        </div>
        <div className="flex gap-3">
          <label className="flex flex-col gap-1 text-sm text-zinc-400">
            Статус
            <select
              value={filters.status ?? ""}
              onChange={(event) =>
                setFilters({ status: event.target.value ? (event.target.value as CarNumberLotStatus) : undefined })
              }
              className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Все</option>
              {statuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <CarNumberLotTable
        lots={lots.items}
        onEdit={(lot) => setEditing(lot)}
        onDelete={async (lot) => {
          try {
            await deleteLot(lot.id);
            toast.success("Объявление удалено");
            fetchAdminLots({ page, limit, status: filters.status });
          } catch (error) {
            console.error(error);
            toast.error("Не удалось удалить");
          }
        }}
        actionSlot={(lot) => (
          <div className="flex items-center gap-2">
            {canConfirm(lot) && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await confirmLot(lot.id);
                    toast.success("Объявление опубликовано");
                    fetchAdminLots({ page, limit, status: filters.status });
                  } catch (error) {
                    console.error(error);
                    toast.error("Ошибка подтверждения");
                  }
                }}
                className="rounded bg-emerald-500 px-2 py-1 text-xs font-semibold text-zinc-900 hover:bg-emerald-400"
              >
                Подтвердить
              </button>
            )}
            <span className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{lot.status}</span>
          </div>
        )}
      />
      {loading && <div className="text-sm text-zinc-400">Загрузка...</div>}

      {editing && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Редактирование объявления</h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              Отменить
            </button>
          </div>
          <form
            className="grid gap-4 md:grid-cols-3"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!editing) return;
              try {
                await updateLot(editing.id, {
                  price: price === "" ? undefined : Number(price),
                  status: status === "" ? undefined : status,
                });
                toast.success("Объявление обновлено");
                setEditing(null);
                fetchAdminLots({ page, limit, status: filters.status });
              } catch (error) {
                console.error(error);
                toast.error("Не удалось обновить");
              }
            }}
          >
            <label className="flex flex-col gap-1 text-sm text-zinc-400">
              Новая цена
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value ? Number(event.target.value) : "")}
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-400">
              Статус
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as CarNumberLotStatus)}
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Не менять</option>
                {statuses.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-emerald-400"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default AdminCarNumberLotsPage;
