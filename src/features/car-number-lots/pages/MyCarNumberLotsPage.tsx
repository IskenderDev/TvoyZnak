import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CarNumberLotForm } from "@/features/car-number-lots/components/CarNumberLotForm";
import { CarNumberLotTable } from "@/features/car-number-lots/components/CarNumberLotTable";
import { useCarNumberLots } from "@/features/car-number-lots/hooks/useCarNumberLots";
import { usePagination } from "@/shared/hooks/usePagination";
import type { CarNumberLot, CarNumberLotPayload } from "@/shared/types";

export function MyCarNumberLotsPage() {
  const { items, fetchMyLots, loading, updateLot, deleteLot } = useCarNumberLots();
  const { page, limit } = usePagination();
  const [editing, setEditing] = useState<CarNumberLot | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMyLots({ page, limit });
  }, [fetchMyLots, limit, page]);

  const handleUpdate = useCallback(
    async (payload: CarNumberLotPayload) => {
      if (!editing) return;
      try {
        setSaving(true);
        await updateLot(editing.id, payload);
        toast.success("Объявление обновлено");
        setEditing(null);
        fetchMyLots({ page, limit });
      } catch (error) {
        console.error(error);
        toast.error("Не удалось обновить объявление");
      } finally {
        setSaving(false);
      }
    },
    [editing, fetchMyLots, limit, page, updateLot],
  );

  const handleDelete = useCallback(
    async (lot: CarNumberLot) => {
      try {
        await deleteLot(lot.id);
        toast.success("Объявление удалено");
        fetchMyLots({ page, limit });
      } catch (error) {
        console.error(error);
        toast.error("Не удалось удалить объявление");
      }
    },
    [deleteLot, fetchMyLots, limit, page],
  );

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold text-white">Мои объявления</h1>
        <p className="text-sm text-zinc-400">
          Управляйте опубликованными и ожидающими модерацию объявлениями
        </p>
      </header>

      <CarNumberLotTable
        lots={items}
        onEdit={(lot) => setEditing(lot)}
        onDelete={handleDelete}
        actionSlot={(lot) => (
          <span className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{lot.status}</span>
        )}
      />
      {loading && (
        <div className="text-sm text-zinc-400">Загрузка объявлений...</div>
      )}

      {editing && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Редактирование объявления</h2>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              Отменить
            </button>
          </div>
          <CarNumberLotForm
            defaultValues={editing}
            isAuthenticated={true}
            loading={saving}
            onSubmit={async (values: CarNumberLotPayload) => {
              await handleUpdate(values);
            }}
          />
        </div>
      )}
    </section>
  );
}

export default MyCarNumberLotsPage;
