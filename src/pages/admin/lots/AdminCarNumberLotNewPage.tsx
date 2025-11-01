import { useState } from "react";

import PageTitle from "@/shared/components/PageTitle";
import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import { useCarNumberLots } from "@/shared/hooks/useCarNumberLots";

interface FormState {
  series: string;
  regionCode: string;
  price: string;
  sellerName: string;
  phone?: string;
  description?: string;
}

const INITIAL_STATE: FormState = {
  series: "",
  regionCode: "",
  price: "",
  sellerName: "",
  phone: "",
  description: "",
};

export default function AdminCarNumberLotNewPage() {
  const { create } = useCarNumberLots();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const priceNumber = Number(form.price.replace(/[^0-9.,-]/g, "").replace(/,/g, "."));
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setError("Введите корректную стоимость");
      setSubmitting(false);
      return;
    }

    if (!form.series.trim() || !form.regionCode.trim() || !form.sellerName.trim()) {
      setError("Заполните обязательные поля");
      setSubmitting(false);
      return;
    }

    try {
      await create({
        series: form.series.trim(),
        regionCode: form.regionCode.trim(),
        price: priceNumber,
        sellerName: form.sellerName.trim(),
        phone: form.phone?.trim() ? form.phone.trim() : undefined,
        description: form.description?.trim() ? form.description.trim() : undefined,
      });
      setMessage("Объявление успешно создано");
      setForm(INITIAL_STATE);
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Не удалось создать объявление"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <Seo title="Админка — Новое объявление" description="Создание нового объявления о продаже номера." />
      <PageTitle>Создать объявление</PageTitle>

      {message ? <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-[#0F1624] p-6 text-white">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
            Серия (Буквы и цифры)
            <input
              type="text"
              name="series"
              value={form.series}
              onChange={handleChange}
              placeholder="А123БВ"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
            Регион
            <input
              type="text"
              name="regionCode"
              value={form.regionCode}
              onChange={handleChange}
              placeholder="77"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
            Стоимость (₽)
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="1000000"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
            Имя продавца
            <input
              type="text"
              name="sellerName"
              value={form.sellerName}
              onChange={handleChange}
              placeholder="Имя"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
            Телефон
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+7 (999) 000-00-00"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
            Описание
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Дополнительная информация"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Сохраняем…" : "Создать объявление"}
        </Button>
      </form>
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
