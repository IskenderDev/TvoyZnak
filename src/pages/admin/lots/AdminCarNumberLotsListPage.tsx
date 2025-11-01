import { useEffect, useMemo, useState } from "react";
import { LuCheck, LuRefreshCw, LuTrash2 } from "react-icons/lu";

import PageTitle from "@/shared/components/PageTitle";
import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import PlateStaticSm from "@/shared/components/plate/PlateStaticSm";
import { useAdmin } from "@/shared/hooks/useAdmin";

interface LotFormState {
  price: string;
  status: string;
}

export default function AdminCarNumberLotsListPage() {
  const { lots, loadLots, confirmLot, updateLot, removeLot, loading, error } = useAdmin();
  const [formState, setFormState] = useState<Record<string, LotFormState>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadLots().catch((err) => {
      setActionError(extractErrorMessage(err, "Не удалось загрузить объявления"));
    });
  }, [loadLots]);

  useEffect(() => {
    setFormState(
      lots.reduce<Record<string, LotFormState>>((acc, lot) => {
        acc[lot.id] = {
          price: String(lot.price ?? 0),
          status: lot.status ?? "",
        };
        return acc;
      }, {}),
    );
  }, [lots]);

  const combinedError = useMemo(() => actionError ?? error, [actionError, error]);

  const handlePriceChange = (id: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        price: value,
      },
    }));
  };

  const handleStatusChange = (id: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: value,
      },
    }));
  };

  const handleSave = async (id: string) => {
    const current = formState[id];
    if (!current) return;

    const priceNumber = Number(current.price.replace(/[^0-9.,-]/g, "").replace(/,/g, "."));
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setActionError("Введите корректную цену");
      return;
    }

    setSavingId(id);
    setActionError(null);
    try {
      await updateLot(id, { price: priceNumber, status: current.status });
    } catch (err: unknown) {
      setActionError(extractErrorMessage(err, "Не удалось обновить объявление"));
    } finally {
      setSavingId(null);
    }
  };

  const handleConfirm = async (id: string) => {
    setConfirmingId(id);
    setActionError(null);
    try {
      await confirmLot(id);
    } catch (err: unknown) {
      setActionError(extractErrorMessage(err, "Не удалось подтвердить объявление"));
    } finally {
      setConfirmingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setActionError(null);
    try {
      await removeLot(id);
    } catch (err: unknown) {
      setActionError(extractErrorMessage(err, "Не удалось удалить объявление"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <Seo title="Админка — Объявления — Знак отличия" description="Управление объявлениями о продаже номеров." />
      <PageTitle>Управление объявлениями</PageTitle>

      {combinedError ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{combinedError}</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0F1624]">
        <table className="min-w-full divide-y divide-white/10 text-sm text-white/80">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Номер</th>
              <th className="px-4 py-3 text-left">Цена</th>
              <th className="px-4 py-3 text-left">Статус</th>
              <th className="px-4 py-3 text-left">Продавец</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && lots.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                  Загружаем объявления…
                </td>
              </tr>
            ) : null}
            {lots.map((lot) => {
              const current = formState[lot.id] ?? { price: String(lot.price ?? 0), status: lot.status ?? "" };
              return (
                <tr key={lot.id} className="align-top">
                  <td className="px-4 py-4 font-mono text-xs text-white/60">{lot.id}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <PlateStaticSm
                        data={{
                          price: lot.price,
                          firstLetter: lot.plate.firstLetter,
                          secondLetter: lot.plate.secondLetter,
                          thirdLetter: lot.plate.thirdLetter,
                          firstDigit: lot.plate.firstDigit,
                          secondDigit: lot.plate.secondDigit,
                          thirdDigit: lot.plate.thirdDigit,
                          comment: lot.plate.comment ?? lot.description ?? "",
                          regionId: Number(lot.plate.regionId ?? lot.region ?? 0) || 0,
                        }}
                        showCaption={false}
                      />
                      <span className="text-xs text-white/50">Создано: {formatDate(lot.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <label className="flex flex-col gap-1 text-xs text-white/50">
                      <span>Цена (₽)</span>
                      <input
                        type="text"
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                        value={current.price}
                        onChange={(event) => handlePriceChange(lot.id, event.target.value)}
                      />
                    </label>
                  </td>
                  <td className="px-4 py-4">
                    <label className="flex flex-col gap-1 text-xs text-white/50">
                      <span>Статус</span>
                      <select
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                        value={current.status}
                        onChange={(event) => handleStatusChange(lot.id, event.target.value)}
                      >
                        <option value="">—</option>
                        <option value="pending">На модерации</option>
                        <option value="approved">Опубликовано</option>
                        <option value="sold">Продано</option>
                        <option value="hidden">Скрыто</option>
                      </select>
                    </label>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-white">{lot.sellerName ?? lot.seller ?? "—"}</span>
                      <span className="text-white/50">{lot.sellerInfo?.email ?? "—"}</span>
                      <span className="text-white/50">{lot.sellerInfo?.phoneNumber ?? "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                      <Button
                        onClick={() => handleSave(lot.id)}
                        disabled={savingId === lot.id}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
                      >
                        <LuRefreshCw className="h-4 w-4" />
                        {savingId === lot.id ? "Сохраняем" : "Сохранить"}
                      </Button>
                      <Button
                        onClick={() => handleConfirm(lot.id)}
                        disabled={confirmingId === lot.id}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 transition hover:bg-emerald-500/20 disabled:opacity-60"
                      >
                        <LuCheck className="h-4 w-4" />
                        {confirmingId === lot.id ? "Подтверждаем" : "Подтвердить"}
                      </Button>
                      <Button
                        onClick={() => handleDelete(lot.id)}
                        disabled={deletingId === lot.id}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-100 transition hover:bg-red-500/20 disabled:opacity-60"
                      >
                        <LuTrash2 className="h-4 w-4" />
                        {deletingId === lot.id ? "Удаляем" : "Удалить"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && lots.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                  Объявления не найдены.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const record = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown } | unknown };
    };

    const responseData = record.response?.data;
    if (responseData && typeof responseData === "object") {
      const dataRecord = responseData as { message?: unknown; error?: unknown };
      const message = dataRecord.message ?? dataRecord.error;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }

  return fallback;
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
