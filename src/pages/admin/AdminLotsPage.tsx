import { useMemo, useState, type ReactNode } from "react";
import { FiRefreshCw, FiSearch } from "react-icons/fi";

import AdminLotsTable from "@/components/admin/AdminLotsTable";
import AdminLotEditModal from "@/components/admin/AdminLotEditModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { AdminLot } from "@/api/adminLots";
import type { UpdateAdminLotPayload } from "@/api/adminLots";
import Seo from "@/shared/components/Seo";
import PageTitle from "@/shared/components/PageTitle";
import { useAdminLots, type AdminLotSortKey, type AdminLotStatusFilter } from "@/hooks/useAdminLots";

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

  const handleEditSubmit = async (payload: UpdateAdminLotPayload) => {
    if (!editingLot) {
      return;
    }
    await update(editingLot.id, payload);
    setEditingLot(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) {
      return;
    }
    try {
      await remove(deleteCandidate.id);
    } finally {
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="space-y-6">
      <Seo title="Админка — Лоты" description="Управление лотами номеров" />
      <PageTitle>Админка: лоты номеров</PageTitle>

      <section className="rounded-3xl border border-white/10 bg-neutral-950 px-4 py-5 text-white shadow-2xl sm:px-6">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <label className="relative block">
              <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">
                <FiSearch className="h-4 w-4" />
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Поиск по номеру, ФИО, телефону или региону"
                className="w-full rounded-2xl border border-white/10 bg-neutral-900 py-2 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="admin-lots-page-size" className="text-xs uppercase tracking-wide text-neutral-400">
                На странице
              </label>
              <select
                id="admin-lots-page-size"
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="admin-lots-sort" className="text-xs uppercase tracking-wide text-neutral-400">
                Сортировка
              </label>
              <select
                id="admin-lots-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as AdminLotSortKey)}
                className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={toggleSortDirection}
                className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-1.5 text-sm font-medium uppercase tracking-wide text-neutral-200 transition hover:bg-white/10"
              >
                {sortDir === "asc" ? "▲" : "▼"}
              </button>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-200 transition hover:bg-white/10"
            >
              <FiRefreshCw className="h-4 w-4" /> Сбросить
            </button>
          </div>
        </header>

        <div className="mt-4 flex flex-wrap gap-2">
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

        <div className="mt-6">
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
        </div>
      </section>

      <AdminLotEditModal
        open={Boolean(editingLot)}
        lot={editingLot}
        submitting={editingLot ? updatingIds.has(editingLot.id) : false}
        onClose={() => setEditingLot(null)}
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
        confirmLoading={deleteCandidate ? deletingIds.has(deleteCandidate.id) : false}
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
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        active
          ? "bg-emerald-500 text-black shadow-lg"
          : "border border-white/10 bg-neutral-900 text-neutral-200 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
