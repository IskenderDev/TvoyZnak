import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuPencil, LuPlus, LuRefreshCw, LuTrash2 } from "react-icons/lu";

import PageTitle from "@/shared/components/PageTitle";
import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import { useAdmin } from "@/shared/hooks/useAdmin";
import { paths } from "@/shared/routes/paths";

export default function AdminPostsListPage() {
  const { posts, loadPosts, removePost, loading, error } = useAdmin();
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    loadPosts().catch((err) => {
      setActionError(extractErrorMessage(err, "Не удалось загрузить публикации"));
    });
  }, [loadPosts]);

  const combinedError = useMemo(() => actionError ?? error, [actionError, error]);

  const handleRefresh = async () => {
    setReloading(true);
    setActionError(null);
    try {
      await loadPosts();
    } catch (err: unknown) {
      setActionError(extractErrorMessage(err, "Не удалось обновить список публикаций"));
    } finally {
      setReloading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить публикацию?")) {
      return;
    }

    setDeletingId(id);
    setActionError(null);
    try {
      await removePost(id);
    } catch (err: unknown) {
      setActionError(extractErrorMessage(err, "Не удалось удалить публикацию"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <Seo title="Админка — Публикации" description="Список публикаций и управление ими." />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle>Публикации</PageTitle>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={reloading}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            <LuRefreshCw className="h-4 w-4" />
            {reloading ? "Обновляем" : "Обновить"}
          </Button>
          <Link
            to={paths.admin.postNew}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
          >
            <LuPlus className="h-4 w-4" />
            Новая публикация
          </Link>
        </div>
      </div>

      {combinedError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{combinedError}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0F1624]">
        <table className="min-w-full divide-y divide-white/10 text-sm text-white/80">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Заголовок</th>
              <th className="px-4 py-3 text-left">Статус</th>
              <th className="px-4 py-3 text-left">Опубликовано</th>
              <th className="px-4 py-3 text-left">Описание</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                  Загружаем публикации…
                </td>
              </tr>
            ) : null}
            {posts.map((post) => (
              <tr key={post.id} className="align-top">
                <td className="px-4 py-4 font-mono text-xs text-white/60">{post.id}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">{post.title}</span>
                    <span className="text-xs text-white/40">{post.slug}</span>
                  </div>
                </td>
                <td className="px-4 py-4 capitalize">{post.status ?? "—"}</td>
                <td className="px-4 py-4">{formatDate(post.publishedAt)}</td>
                <td className="px-4 py-4 text-white/60">{post.excerpt ?? "—"}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                      to={paths.admin.postEdit(post.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
                    >
                      <LuPencil className="h-4 w-4" />
                      Редактировать
                    </Link>
                    <Button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-100 transition hover:bg-red-500/20 disabled:opacity-60"
                    >
                      <LuTrash2 className="h-4 w-4" />
                      {deletingId === post.id ? "Удаляем" : "Удалить"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                  Публикации не найдены.
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
