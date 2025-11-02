import type { ReactNode } from "react";

import type { CarNumberLot } from "@/shared/types";

interface Props {
  lots: CarNumberLot[];
  onEdit?: (lot: CarNumberLot) => void;
  onDelete?: (lot: CarNumberLot) => void;
  actionSlot?: (lot: CarNumberLot) => ReactNode;
}

export function CarNumberLotTable({ lots, onEdit, onDelete, actionSlot }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-800">
        <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-3 py-2 text-left">Номер</th>
            <th className="px-3 py-2 text-left">Заголовок</th>
            <th className="px-3 py-2 text-left">Регион</th>
            <th className="px-3 py-2 text-left">Цена</th>
            <th className="px-3 py-2 text-left">Статус</th>
            <th className="px-3 py-2 text-left">Владелец</th>
            <th className="px-3 py-2 text-left">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800 bg-zinc-950/50 text-sm text-zinc-200">
          {lots.map((lot) => (
            <tr key={lot.id}>
              <td className="px-3 py-2 font-mono text-base text-white">{lot.number}</td>
              <td className="px-3 py-2">{lot.title}</td>
              <td className="px-3 py-2">{lot.region}</td>
              <td className="px-3 py-2 font-semibold text-emerald-400">
                {lot.price.toLocaleString()} ₽
              </td>
              <td className="px-3 py-2 capitalize">{lot.status}</td>
              <td className="px-3 py-2">{lot.owner.fullName}</td>
              <td className="flex gap-2 px-3 py-2">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(lot)}
                    className="rounded bg-zinc-800 px-2 py-1 text-xs font-semibold text-white hover:bg-zinc-700"
                  >
                    Изменить
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(lot)}
                    className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500"
                  >
                    Удалить
                  </button>
                )}
                {actionSlot?.(lot)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {lots.length === 0 && (
        <div className="p-4 text-center text-sm text-zinc-400">Нет объявлений</div>
      )}
    </div>
  );
}

export default CarNumberLotTable;
