import type { ComponentType } from "react";
import { FiCheck, FiEdit2, FiLoader, FiTrash2 } from "react-icons/fi";
import { LuChevronDown } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

import type { AdminLot } from "@/api/adminLots";
import type { AdminLotSortKey, SortDirection } from "@/hooks/useAdminLots";
import Button from "@/shared/ui/Button";
import IconButton from "@/shared/ui/IconButton";
import Spinner from "@/shared/ui/Spinner";
import Table from "@/shared/ui/Table";

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
  const renderSortableHeader = (key: AdminLotSortKey) => {
    const isActive = sortBy === key;
    const directionClass = isActive && sortDir === "asc" ? "rotate-180" : "";

    return (
      <button
        type="button"
        onClick={() => (isActive ? onToggleSortDir() : onSortChange(key))}
        className={twMerge(
          "inline-flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wide transition",
          isActive ? "text-blue-600" : "text-slate-500 hover:text-blue-500",
        )}
      >
        <span>{SORT_LABELS[key]}</span>
        <LuChevronDown className={twMerge("h-4 w-4 transition", isActive ? directionClass : "opacity-50")} />
      </button>
    );
  };

  const renderStatusRow = (message: string, withSpinner = false) => (
    <Table.Row>
      <Table.Cell colSpan={10} className="px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
          {withSpinner ? <Spinner size="sm" /> : null}
          <span>{message}</span>
        </div>
      </Table.Cell>
    </Table.Row>
  );

  const shownCount = Math.min(totalItems, (page - 1) * pageSize + lots.length);

  return (
    <div className="space-y-4">
      <Table>
        <Table.Head>
          <Table.HeaderCell>Номер</Table.HeaderCell>
          <Table.HeaderCell>Регион</Table.HeaderCell>
          <Table.HeaderCell>{renderSortableHeader("originalPrice")}</Table.HeaderCell>
          <Table.HeaderCell>{renderSortableHeader("markupPrice")}</Table.HeaderCell>
          <Table.HeaderCell>Продавец</Table.HeaderCell>
          <Table.HeaderCell>Телефон</Table.HeaderCell>
          <Table.HeaderCell>{renderSortableHeader("createdDate")}</Table.HeaderCell>
          <Table.HeaderCell>Статус</Table.HeaderCell>
          <Table.HeaderCell className="max-w-xs">Комментарий</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Действия</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          {loading
            ? renderStatusRow("Загрузка лотов…", true)
            : error
              ? renderStatusRow(error)
              : lots.length === 0
                ? renderStatusRow("Лоты не найдены")
                : lots.map((lot) => {
                    const isConfirming = confirmingIds.has(lot.id);
                    const isDeleting = deletingIds.has(lot.id);
                    const isUpdating = updatingIds.has(lot.id);
                    return (
                      <Table.Row key={lot.id}>
                        <Table.Cell className="font-semibold text-slate-900">{lot.fullCarNumber}</Table.Cell>
                        <Table.Cell>{lot.regionCode}</Table.Cell>
                        <Table.Cell>{currency.format(lot.originalPrice)}</Table.Cell>
                        <Table.Cell>{currency.format(lot.markupPrice)}</Table.Cell>
                        <Table.Cell>{lot.fullName || lot.author?.fullName || "—"}</Table.Cell>
                        <Table.Cell>{lot.phoneNumber || lot.author?.phoneNumber || "—"}</Table.Cell>
                        <Table.Cell>{formatDate(lot.createdDate)}</Table.Cell>
                        <Table.Cell>
                          <StatusBadge confirmed={lot.isConfirm} />
                        </Table.Cell>
                        <Table.Cell className="text-sm text-slate-600">
                          {lot.comment?.trim() ? lot.comment : "—"}
                        </Table.Cell>
                        <Table.Cell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <ActionIconButton
                              label={lot.isConfirm ? "Лот подтверждён" : "Подтвердить лот"}
                              icon={FiCheck}
                              tone="success"
                              disabled={lot.isConfirm || isConfirming || isDeleting}
                              loading={isConfirming}
                              onClick={() => onConfirm(lot)}
                            />
                            <ActionIconButton
                              label="Редактировать"
                              icon={FiEdit2}
                              disabled={isDeleting}
                              loading={isUpdating}
                              onClick={() => onEdit(lot)}
                            />
                            <ActionIconButton
                              label="Удалить"
                              icon={FiTrash2}
                              tone="danger"
                              disabled={isDeleting}
                              loading={isDeleting}
                              onClick={() => onDelete(lot)}
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
        </Table.Body>
      </Table>

      <Table.Mobile>
        {loading ? (
          <Table.Card>
            <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
              <Spinner size="sm" />
              <span>Загрузка лотов…</span>
            </div>
          </Table.Card>
        ) : error ? (
          <Table.Card>
            <p className="text-center text-sm text-red-500">{error}</p>
          </Table.Card>
        ) : lots.length === 0 ? (
          <Table.Card>
            <p className="text-center text-sm text-slate-500">Лоты не найдены</p>
          </Table.Card>
        ) : (
          lots.map((lot) => {
            const isConfirming = confirmingIds.has(lot.id);
            const isDeleting = deletingIds.has(lot.id);
            const isUpdating = updatingIds.has(lot.id);
            return (
              <Table.Card key={lot.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{lot.fullCarNumber}</p>
                    <p className="text-xs text-slate-500">{formatDate(lot.createdDate)}</p>
                  </div>
                  <StatusBadge confirmed={lot.isConfirm} />
                </div>

                <div className="grid gap-3">
                  <Table.CardField label="Регион">{lot.regionCode}</Table.CardField>
                  <Table.CardField label="Оригинальная цена">
                    {currency.format(lot.originalPrice)}
                  </Table.CardField>
                  <Table.CardField label="Наценка">
                    {currency.format(lot.markupPrice)}
                  </Table.CardField>
                  <Table.CardField label="Продавец">{lot.fullName || lot.author?.fullName || "—"}</Table.CardField>
                  <Table.CardField label="Телефон">{lot.phoneNumber || lot.author?.phoneNumber || "—"}</Table.CardField>
                  <Table.CardField label="Комментарий">
                    {lot.comment?.trim() ? lot.comment : "—"}
                  </Table.CardField>
                </div>

                <div className="mt-2 flex items-center justify-end gap-2">
                  <ActionIconButton
                    label={lot.isConfirm ? "Лот подтверждён" : "Подтвердить"}
                    icon={FiCheck}
                    tone="success"
                    disabled={lot.isConfirm || isConfirming || isDeleting}
                    loading={isConfirming}
                    onClick={() => onConfirm(lot)}
                  />
                  <ActionIconButton
                    label="Редактировать"
                    icon={FiEdit2}
                    disabled={isDeleting}
                    loading={isUpdating}
                    onClick={() => onEdit(lot)}
                  />
                  <ActionIconButton
                    label="Удалить"
                    icon={FiTrash2}
                    tone="danger"
                    disabled={isDeleting}
                    loading={isDeleting}
                    onClick={() => onDelete(lot)}
                  />
                </div>
              </Table.Card>
            );
          })
        )}
      </Table.Mobile>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <span>
          Показано {shownCount} из {totalItems}
        </span>
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
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Назад
      </Button>
      <span className="text-xs font-medium text-slate-500">
        Страница {page} из {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Вперёд
      </Button>
    </nav>
  );
}

type ActionIconButtonProps = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: "default" | "danger" | "success";
};

function ActionIconButton({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  loading = false,
  tone = "default",
}: ActionIconButtonProps) {
  return (
    <IconButton
      label={label}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        "h-9 w-9 rounded-xl",
        tone === "danger"
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : tone === "success"
            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200",
        loading ? "cursor-wait" : "",
      )}
    >
      {loading ? <FiLoader className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
    </IconButton>
  );
}

type StatusBadgeProps = {
  confirmed: boolean;
};

function StatusBadge({ confirmed }: StatusBadgeProps) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        confirmed ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600",
      )}
    >
      {confirmed ? "Подтверждено" : "Ожидает"}
    </span>
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
