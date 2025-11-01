import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuCheck, LuRefreshCcw, LuTrash2 } from "react-icons/lu";

import PageTitle from "@/shared/components/PageTitle";
import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import PlateStaticSm from "@/shared/components/plate/PlateStaticSm";
import { useAdmin } from "@/shared/hooks/useAdmin";
import { paths } from "@/shared/routes/paths";
import type { CarNumberLot } from "@/entities/car-number-lot/types";

interface FormState {
  price: string;
  status: string;
  description: string;
}

const STATUS_OPTIONS = [
  { value: "", label: "—" },
  { value: "pending", label: "На модерации" },
  { value: "approved", label: "Опубликовано" },
  { value: "sold", label: "Продано" },
  { value: "hidden", label: "Скрыто" },
];

export default function AdminCarNumberLotEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lots, getLot, updateLot, confirmLot, removeLot } = useAdmin();

  const [lot, setLot] = useState<CarNumberLot | null>(null);
  const [form, setForm] = useState<FormState>({ price: "", status: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const lotFromStore = useMemo(() => (id ? lots.find((item) => item.id === id) ?? null : null), [id, lots]);

  useEffect(() => {
    if (!id) return;

    if (lotFromStore) {
      setLot(lotFromStore);
      setForm({
        price: lotFromStore.price ? String(lotFromStore.price) : "",
        status: lotFromStore.status ?? "",
        description: lotFromStore.description ?? "",
      });
      return;
    }

    let ignore = false;
    setLoading(true);
    setError(null);
    getLot(id)
      .then((loaded) => {
        if (ignore) return;
        setLot(loaded);
        setForm({
          price: loaded.price ? String(loaded.price) : "",
          status: loaded.status ?? "",
          description: loaded.description ?? "",
        });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setError(extractErrorMessage(err, "Не удалось загрузить объявление"));
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [getLot, id, lotFromStore]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (
    event,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!id) return;

    const priceNumber = Number(form.price.replace(/[^0-9.,-]/g, "").replace(/,/g, "."));
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setError("Введите корректную цену");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateLot(id, {
        price: priceNumber,
        status: form.status || undefined,
        description: form.description?.trim() ? form.description.trim() : undefined,
      });
      setLot(updated);
      setSuccess("Изменения сохранены");
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Не удалось сохранить изменения"));
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (!id) return;
    setConfirming(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await confirmLot(id);
      setLot(updated);
      setForm((prev) => ({ ...prev, status: updated.status ?? prev.status }));
      setSuccess("Объявление подтверждено");
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Не удалось подтвердить объявление"));
    } finally {
      setConfirming(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Удалить объявление?")) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await removeLot(id);
      navigate(paths.admin.carNumberLots, { replace: true });
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Не удалось удалить объявление"));
    } finally {
      setDeleting(false);
    }
  };

  if (!id) {
    return (
      <section className="space-y-6">
        <Seo title="Админка — Объявление" />
        <PageTitle>Объявление не найдено</PageTitle>
        <p className="text-white/60">Не указан идентификатор объявления.</p>
      </section>
    );
  }

  if (loading && !lot) {
    return (
      <section className="space-y-6">
        <Seo title="Админка — Объявление" />
        <PageTitle>Загружаем объявление…</PageTitle>
        <p className="text-white/60">Подождите, информация подгружается.</p>
      </section>
    );
  }

  if (!lot) {
    return (
      <section className="space-y-6">
        <Seo title="Админка — Объявление" />
        <PageTitle>Объявление не найдено</PageTitle>
        {error ? <p className="text-red-300">{error}</p> : <p className="text-white/60">Проверьте ссылку и попробуйте снова.</p>}
      </section>
    );
  }

  const formattedCreatedAt = formatDate(lot.createdAt);

  return (
    <section className="space-y-6">
      <Seo
        title={`Админка — ${lot.series} — Знак отличия`}
        description="Редактирование объявления о продаже номерного знака."
      />
      <PageTitle>Редактировать объявление</PageTitle>

      {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      {success ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{success}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,320px),1fr]">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0F1624] p-6 text-white">
          <PlateStaticSm
            data={{
              price: lot.price,
              firstLetter: lot.plate.firstLetter,
              secondLetter: lot.plate.secondLetter,
              thirdLetter: lot.plate.thirdLetter,
              firstDigit: lot.plate.firstDigit,
              secondDigit: lot.plate.secondDigit,
              thirdDigit: lot.plate.thirdDigit,
              regionId: Number(lot.plate.regionId ?? lot.region ?? 0) || 0,
              comment: lot.description ?? lot.plate.comment ?? "",
            }}
            showCaption={false}
          />
          <dl className="grid gap-2 text-sm text-white/70">
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">ID</dt>
              <dd className="font-mono">{lot.id}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">Создано</dt>
              <dd>{formattedCreatedAt}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">Продавец</dt>
              <dd className="text-right">
                <div>{lot.sellerName ?? lot.seller ?? "—"}</div>
                {lot.sellerInfo?.email ? <div className="text-xs text-white/50">{lot.sellerInfo.email}</div> : null}
                {lot.sellerInfo?.phoneNumber ? <div className="text-xs text-white/50">{lot.sellerInfo.phoneNumber}</div> : null}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F1624] p-6 text-white">
          <div className="grid gap-4">
            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
              Стоимость (₽)
              <input
                type="text"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
              Статус
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value || "empty"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
              Описание
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
            >
              <LuRefreshCcw className="h-4 w-4" />
              {saving ? "Сохраняем" : "Сохранить"}
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={confirming}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 transition hover:bg-emerald-500/20 disabled:opacity-60"
            >
              <LuCheck className="h-4 w-4" />
              {confirming ? "Подтверждаем" : "Подтвердить"}
            </Button>

            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-red-100 transition hover:bg-red-500/20 disabled:opacity-60"
            >
              <LuTrash2 className="h-4 w-4" />
              {deleting ? "Удаляем" : "Удалить"}
            </Button>
          </div>
        </div>
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
