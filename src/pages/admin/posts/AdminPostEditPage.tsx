import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LuArrowLeft, LuSave } from "react-icons/lu";

import PageTitle from "@/shared/components/PageTitle";
import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import { useAdmin } from "@/shared/hooks/useAdmin";
import { paths } from "@/shared/routes/paths";
import type { Post } from "@/entities/post/types";

interface FormState {
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  status: string;
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Черновик" },
  { value: "published", label: "Опубликовано" },
  { value: "archived", label: "Архив" },
];

export default function AdminPostEditPage() {
  const { id } = useParams<{ id: string }>();
  const { posts, getPost, updatePost } = useAdmin();

  const [post, setPost] = useState<Post | null>(null);
  const [form, setForm] = useState<FormState>({ title: "", excerpt: "", content: "", cover: "", status: "draft" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const postFromStore = useMemo(() => (id ? posts.find((item) => item.id === id) ?? null : null), [id, posts]);

  useEffect(() => {
    if (!id) return;

    if (postFromStore) {
      setPost(postFromStore);
      setForm({
        title: postFromStore.title ?? "",
        excerpt: postFromStore.excerpt ?? "",
        content: postFromStore.content ?? "",
        cover: postFromStore.cover ?? "",
        status: postFromStore.status ?? "draft",
      });
      return;
    }

    let ignore = false;
    setLoading(true);
    setError(null);

    getPost(id)
      .then((loaded) => {
        if (ignore) return;
        setPost(loaded);
        setForm({
          title: loaded.title ?? "",
          excerpt: loaded.excerpt ?? "",
          content: loaded.content ?? "",
          cover: loaded.cover ?? "",
          status: loaded.status ?? "draft",
        });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setError(extractErrorMessage(err, "Не удалось загрузить публикацию"));
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [getPost, id, postFromStore]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (
    event,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!id) return;

    if (!form.title.trim()) {
      setError("Введите заголовок");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updatePost(id, {
        title: form.title.trim(),
        excerpt: form.excerpt.trim() || undefined,
        content: form.content.trim() || undefined,
        cover: form.cover.trim() || undefined,
        status: form.status,
      });
      setPost(updated);
      setSuccess("Изменения сохранены");
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Не удалось сохранить публикацию"));
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <section className="space-y-6">
        <Seo title="Админка — Публикация" />
        <PageTitle>Публикация не найдена</PageTitle>
        <p className="text-white/60">Не указан идентификатор публикации.</p>
      </section>
    );
  }

  if (loading && !post) {
    return (
      <section className="space-y-6">
        <Seo title="Админка — Публикация" />
        <PageTitle>Загружаем публикацию…</PageTitle>
        <p className="text-white/60">Подождите, данные загружаются.</p>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="space-y-6">
        <Seo title="Админка — Публикация" />
        <PageTitle>Публикация не найдена</PageTitle>
        {error ? <p className="text-red-300">{error}</p> : <p className="text-white/60">Проверьте ссылку и попробуйте снова.</p>}
      </section>
    );
  }

  const publishedAt = formatDate(post.publishedAt);

  return (
    <section className="space-y-6">
      <Seo title={`Админка — ${post.title} — Знак отличия`} description="Редактирование публикации." />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle>Редактировать публикацию</PageTitle>
        <Link
          to={paths.admin.posts}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
        >
          <LuArrowLeft className="h-4 w-4" />
          К списку
        </Link>
      </div>

      {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      {success ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{success}</p>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-[#0F1624] p-6 text-white">
        <dl className="mb-6 grid gap-2 text-sm text-white/60">
          <div className="flex justify-between gap-4">
            <dt>ID</dt>
            <dd className="font-mono text-white/80">{post.id}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Slug</dt>
            <dd className="font-mono text-white/80">{post.slug}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Опубликовано</dt>
            <dd>{publishedAt}</dd>
          </div>
        </dl>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-white/40">
            Заголовок
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
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
            disabled={saving}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
          >
            <LuSave className="h-4 w-4" />
            {saving ? "Сохраняем" : "Сохранить"}
          </Button>
        </form>
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
