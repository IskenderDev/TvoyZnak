import type { ComponentType } from "react";
import type { AdminLot } from "@/api/adminLots";
import type { AdminLotSortKey, SortDirection } from "@/hooks/useAdminLots";
import { FiCheck, FiEdit2, FiLoader, FiTrash2 } from "react-icons/fi";
import { LuChevronDown } from "react-icons/lu";

const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type AdminLotsTableProps = {
  lots: AdminLot[];
  loading: boolean;
  error?: string | null;
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortBy: AdminLotSortKey;
  sortDir: SortDirection;
  confirmingIds: ReadonlySet<number>;
  deletingIds: ReadonlySet<number>;
  updatingIds: ReadonlySet<number>;
  onConfirm: (lot: AdminLot) => void;
  onEdit: (lot: AdminLot) => void;
  onDelete: (lot: AdminLot) => void;
  onPageChange: (page: number) => void;
  onSortChange: (key: AdminLotSortKey) => void;
  onToggleSortDir: () => void;
};

export default function AdminLotsTable({
  lots,
  loading,
  error,
  totalItems,
  page,
  pageSize,
  totalPages,
  sortBy,
  sortDir,
  confirmingIds,
  deletingIds,
  updatingIds,
  onConfirm,
  onEdit,
  onDelete,
  onPageChange,
  onSortChange,
  onToggleSortDir,
}: AdminLotsTableProps) {
  const renderSortIcon = (key: AdminLotSortKey) => (
    <button
      type="button"
      onClick={() => (sortBy === key ? onToggleSortDir() : onSortChange(key))}
      className="flex items-center gap-1 text-left text-sm font-medium text-neutral-100 hover:text-white"
    >
      <span>{SORT_LABELS[key]}</span>
      <LuChevronDown
        className={`h-4 w-4 transition ${sortBy === key ? (sortDir === "desc" ? "rotate-180" : "") : "opacity-40"}`}
      />
    </button>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 text-white shadow-2xl">
      <div className="hidden md:block">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-neutral-900/80 text-xs uppercase tracking-wide text-neutral-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Номер</th>
              <th className="px-4 py-3 text-left font-semibold">Регион</th>
              <th className="px-4 py-3 text-left font-semibold">{renderSortIcon("originalPrice")}</th>
              <th className="px-4 py-3 text-left font-semibold">{renderSortIcon("markupPrice")}</th>
              <th className="px-4 py-3 text-left font-semibold">Продавец</th>
              <th className="px-4 py-3 text-left font-semibold">Телефон</th>
              <th className="px-4 py-3 text-left font-semibold">{renderSortIcon("createdDate")}</th>
              <th className="px-4 py-3 text-left font-semibold">Статус</th>
              <th className="px-4 py-3 text-left font-semibold">Комментарий</th>
              <th className="px-4 py-3 text-right font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-neutral-400">
                  Загрузка лотов...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : lots.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-neutral-400">
                  Лоты не найдены.
                </td>
              </tr>
            ) : (
              lots.map((lot) => {
                const isConfirming = confirmingIds.has(lot.id);
                const isDeleting = deletingIds.has(lot.id);
                const isUpdating = updatingIds.has(lot.id);
                return (
                  <tr key={lot.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-semibold">{lot.fullCarNumber}</td>
                    <td className="px-4 py-3 text-neutral-300">{lot.regionCode}</td>
                    <td className="px-4 py-3 text-neutral-100">{currency.format(lot.originalPrice)}</td>
                    <td className="px-4 py-3 text-neutral-100">{currency.format(lot.markupPrice)}</td>
                    <td className="px-4 py-3 text-neutral-100">{lot.fullName || lot.author?.fullName || "—"}</td>
                    <td className="px-4 py-3 text-neutral-300">{lot.phoneNumber || lot.author?.phoneNumber || "—"}</td>
                    <td className="px-4 py-3 text-neutral-300">{formatDate(lot.createdDate)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge confirmed={lot.isConfirm} />
                    </td>
                    <td className="px-4 py-3 text-neutral-300">{lot.comment || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <RowActionButton
                          icon={FiCheck}
                          label={lot.isConfirm ? "Лот подтверждён" : "Подтвердить лот"}
                          onClick={() => onConfirm(lot)}
                          disabled={lot.isConfirm || isConfirming || isDeleting}
                          loading={isConfirming}
                          tone="success"
                        />
                        <RowActionButton
                          icon={FiEdit2}
                          label="Редактировать"
                          onClick={() => onEdit(lot)}
                          disabled={isDeleting}
                          loading={isUpdating}
                        />
                        <RowActionButton
                          icon={FiTrash2}
                          label="Удалить"
                          onClick={() => onDelete(lot)}
                          disabled={isDeleting}
                          loading={isDeleting}
                          tone="danger"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {loading ? (
          <p className="px-4 py-6 text-center text-neutral-400">Загрузка лотов...</p>
        ) : error ? (
          <p className="px-4 py-6 text-center text-red-400">{error}</p>
        ) : lots.length === 0 ? (
          <p className="px-4 py-6 text-center text-neutral-400">Лоты не найдены.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-white/10">
            {lots.map((lot) => {
              const isConfirming = confirmingIds.has(lot.id);
              const isDeleting = deletingIds.has(lot.id);
              const isUpdating = updatingIds.has(lot.id);
              return (
                <li key={lot.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">{lot.fullCarNumber}</p>
                      <p className="text-xs text-neutral-400">{formatDate(lot.createdDate)}</p>
                    </div>
                    <StatusBadge confirmed={lot.isConfirm} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-300">
                    <InfoRow label="Регион" value={lot.regionCode} />
                    <InfoRow label="Оригинальная цена" value={currency.format(lot.originalPrice)} />
                    <InfoRow label="Наценка" value={currency.format(lot.markupPrice)} />
                    <InfoRow label="Продавец" value={lot.fullName || lot.author?.fullName || "—"} />
                    <InfoRow label="Телефон" value={lot.phoneNumber || lot.author?.phoneNumber || "—"} />
                    <InfoRow label="Комментарий" value={lot.comment || "—"} fullWidth />
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <RowActionButton
                      icon={FiCheck}
                      label={lot.isConfirm ? "Лот подтверждён" : "Подтвердить"}
                      onClick={() => onConfirm(lot)}
                      disabled={lot.isConfirm || isConfirming || isDeleting}
                      loading={isConfirming}
                      tone="success"
                    />
                    <RowActionButton
                      icon={FiEdit2}
                      label="Редактировать"
                      onClick={() => onEdit(lot)}
                      disabled={isDeleting}
                      loading={isUpdating}
                    />
                    <RowActionButton
                      icon={FiTrash2}
                      label="Удалить"
                      onClick={() => onDelete(lot)}
                      disabled={isDeleting}
                      loading={isDeleting}
                      tone="danger"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 bg-neutral-900/70 px-4 py-3 text-xs text-neutral-300 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Показано {Math.min(totalItems, (page - 1) * pageSize + lots.length)} из {totalItems}
        </p>
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
}

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-end gap-2" aria-label="Пагинация">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="rounded-full px-3 py-1 text-sm text-neutral-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
        disabled={page === 1}
      >
        Назад
      </button>
      <span className="text-neutral-400">
        Страница {page} из {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        className="rounded-full px-3 py-1 text-sm text-neutral-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
        disabled={page === totalPages}
      >
        Вперёд
      </button>
    </nav>
  );
}

type RowActionButtonProps = {
  icon: ComponentType<{ size?: number }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: "default" | "danger" | "success";
};

function RowActionButton({ icon: Icon, label, onClick, disabled = false, loading = false, tone = "default" }: RowActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        tone === "danger"
          ? "bg-red-500/20 text-red-200 hover:bg-red-500/30 disabled:text-red-300/60"
          : tone === "success"
            ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 disabled:text-emerald-200/50"
            : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700 disabled:text-neutral-500"
      } ${loading ? "cursor-wait" : ""}`}
      aria-label={label}
      title={label}
    >
      {loading ? <FiLoader className="h-4 w-4 animate-spin" /> : <Icon size={16} />}
    </button>
  );
}

type StatusBadgeProps = {
  confirmed: boolean;
};

function StatusBadge({ confirmed }: StatusBadgeProps) {
  return confirmed ? (
    <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-200">
      Подтверждено
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-200">
      Ожидает
    </span>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

function InfoRow({ label, value, fullWidth = false }: InfoRowProps) {
  return (
    <div className={fullWidth ? "col-span-2" : undefined}>
      <p className="text-neutral-500">{label}</p>
      <p className="font-medium text-white">{value}</p>
    </div>
  );
}

const SORT_LABELS: Record<AdminLotSortKey, string> = {
  createdDate: "Дата",
  originalPrice: "Ориг. цена",
  markupPrice: "Наценка",
};

function formatDate(value: string | number | Date | null | undefined) {
  if (!value) {
    return "—";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return dateFormatter.format(date);
}
