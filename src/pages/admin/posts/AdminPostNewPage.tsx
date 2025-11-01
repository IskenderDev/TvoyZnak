import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSave } from "react-icons/lu";

import PageTitle from "@/shared/components/PageTitle";
import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import { useAdmin } from "@/shared/hooks/useAdmin";
import { paths } from "@/shared/routes/paths";

interface FormState {
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  status: string;
}

const INITIAL_STATE: FormState = {
  title: "",
  excerpt: "",
  content: "",
  cover: "",
  status: "draft",
};

const STATUS_OPTIONS = [
  { value: "draft", label: "Черновик" },
  { value: "published", label: "Опубликовано" },
  { value: "archived", label: "Архив" },
];

export default function AdminPostNewPage() {
  const navigate = useNavigate();
  const { createPost } = useAdmin();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (
    event,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Введите заголовок");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const post = await createPost({
        title: form.title.trim(),
        excerpt: form.excerpt.trim() || undefined,
        content: form.content.trim() || undefined,
        cover: form.cover.trim() || undefined,
        status: form.status,
      });
      navigate(paths.admin.postEdit(post.id));
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Не удалось создать публикацию"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <Seo title="Админка — Новая публикация" description="Создание новой публикации." />
      <PageTitle>Создать публикацию</PageTitle>

      {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-[#0F1624] p-6 text-white">
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
          Заголовок
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="Название публикации"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
          Краткое описание
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="Короткое описание"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
          Контент
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={8}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="Основной текст"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
          Обложка
          <input
            type="url"
            name="cover"
            value={form.cover}
            onChange={handleChange}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="https://example.com/image.jpg"
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
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <Button
          type="submit"
          disabled={submitting}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
        >
          <LuSave className="h-4 w-4" />
          {submitting ? "Сохраняем" : "Создать"}
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
