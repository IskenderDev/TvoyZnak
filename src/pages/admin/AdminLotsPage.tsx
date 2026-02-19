import { useMemo, useState, type ReactNode } from "react";
import { FiRefreshCw, FiSearch } from "react-icons/fi";

import AdminLotsTable from "@/components/admin/AdminLotsTable";
import EditNumberModal, {
  type EditNumberModalSubmitPayload,
} from "@/components/profile/EditNumberModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { AdminLot } from "@/shared/api/adminLots";
import Seo from "@/shared/components/Seo";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import {
  useAdminLots,
  type AdminLotSortKey,
  type AdminLotStatusFilter,
} from "@/shared/hooks/useAdminLots";

const STATUS_OPTIONS: { value: AdminLotStatusFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "pending", label: "Неподтверждённые" },
  { value: "confirmed", label: "Подтверждённые" },
];

const SORT_OPTIONS: { value: AdminLotSortKey; label: string }[] = [
  { value: "createdDate", label: "По дате" },
  { value: "originalPrice", label: "По цене" },
  { value: "markupPrice", label: "По наценке" },
];

export default function AdminLotsPage() {
  const [editingLot, setEditingLot] = useState<AdminLot | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<AdminLot | null>(null);

  const {
    paginatedLots,
    loading,
    error,
    totalItems,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
    search,
    setSearch,
    status,
    setStatus,
    sortBy,
    sortDir,
    setSortBy,
    toggleSortDirection,
    confirm,
    update,
    remove,
    confirmingIds,
    deletingIds,
    updatingIds,
    resetFilters,
  } = useAdminLots();

  const pageSizeOptions = useMemo(() => [10, 25, 50], []);

  const handleConfirm = (lot: AdminLot) => {
    void confirm(lot.id);
  };

  const handleEdit = (lot: AdminLot) => {
    setEditingLot(lot);
  };

  const handleDelete = (lot: AdminLot) => {
    setDeleteCandidate(lot);
  };

  const handleEditSubmit = async (
    lot: AdminLot,
    payload: EditNumberModalSubmitPayload,
  ): Promise<AdminLot> => {
    const updated = await update(lot.id, {
      firstLetter: payload.firstLetter,
      secondLetter: payload.secondLetter,
      thirdLetter: payload.thirdLetter,
      firstDigit: payload.firstDigit,
      secondDigit: payload.secondDigit,
      thirdDigit: payload.thirdDigit,
      regionId: payload.regionId,
      markupPrice: payload.originalPrice,
      comment: payload.comment ?? null,
    });

    return {
      ...lot,
      ...updated,
      markupPrice: updated.markupPrice ?? payload.originalPrice,
      comment: updated.comment ?? payload.comment ?? "",
      regionId: updated.regionId ?? payload.regionId,
      firstLetter: updated.firstLetter ?? payload.firstLetter,
      secondLetter: updated.secondLetter ?? payload.secondLetter,
      thirdLetter: updated.thirdLetter ?? payload.thirdLetter,
      firstDigit: updated.firstDigit ?? payload.firstDigit,
      secondDigit: updated.secondDigit ?? payload.secondDigit,
      thirdDigit: updated.thirdDigit ?? payload.thirdDigit,
    };
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    try {
      await remove(deleteCandidate.id);
    } finally {
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="space-y-8 py-2">
      <Seo title="Админка — Лоты" description="Управление лотами номеров" />

      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Лоты номеров</h1>
        <p className="text-lg text-white/90">
          Управляйте поступающими заявками: подтверждайте, редактируйте и удаляйте
          лоты номеров.
        </p>
      </header>

      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
        <section className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-sm">
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск по номеру, ФИО, телефону или региону"
                  className="pl-11"
                  aria-label="Поиск по лотам"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <ControlGroup label="На странице">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </ControlGroup>

              <ControlGroup label="Сортировка">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as AdminLotSortKey)
                  }
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={toggleSortDirection}
                >
                  {sortDir === "asc"
                    ? "По возрастанию"
                    : "По убыванию"}
                </Button>
              </ControlGroup>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="md:self-end"
              >
                <FiRefreshCw className="h-4 w-4" />
                Сбросить
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <FilterPill
                key={option.value}
                active={status === option.value}
                onClick={() => setStatus(option.value)}
              >
                {option.label}
              </FilterPill>
            ))}
          </div>

          <AdminLotsTable
            lots={paginatedLots}
            loading={loading}
            error={error}
            totalItems={totalItems}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            sortBy={sortBy}
            sortDir={sortDir}
            confirmingIds={confirmingIds}
            deletingIds={deletingIds}
            updatingIds={updatingIds}
            onConfirm={handleConfirm}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={setPage}
            onSortChange={setSortBy}
            onToggleSortDir={toggleSortDirection}
          />
        </section>
      </div>

      <EditNumberModal
        open={Boolean(editingLot)}
        lot={editingLot}
        onClose={() => setEditingLot(null)}
        onUpdated={(updated) => setEditingLot(updated)}
        onSubmit={handleEditSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteCandidate)}
        title="Удалить лот?"
        description={
          deleteCandidate
            ? `Вы действительно хотите удалить лот ${deleteCandidate.fullCarNumber}? Действие нельзя отменить.`
            : undefined
        }
        confirmLabel="Удалить"
        confirmTone="danger"
        confirmLoading={
          deleteCandidate ? deletingIds.has(deleteCandidate.id) : false
        }
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

type FilterPillProps = {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
};

function FilterPill({ active, children, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
        active
          ? "bg-blue-100 text-blue-700 shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

type ControlGroupProps = {
  label: string;
  children: ReactNode;
};

function ControlGroup({ label, children }: ControlGroupProps) {
  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-slate-600">
      <span className="uppercase tracking-wide text-xs text-slate-500">
        {label}
      </span>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}
