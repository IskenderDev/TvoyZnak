import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { useAdmin } from "@/features/admin/hooks/useAdmin";
import { usePagination } from "@/shared/hooks/usePagination";
import type { Post, PostPayload } from "@/shared/types";

export function AdminPostsPage() {
  const { posts, fetchPosts, createPost, updatePost, deletePost, loading } = useAdmin();
  const { page, limit } = usePagination();
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<PostPayload>({ title: "", body: "" });

  useEffect(() => {
    fetchPosts({ page, limit });
  }, [fetchPosts, limit, page]);

  useEffect(() => {
    if (editing) {
      setForm({ title: editing.title, body: editing.body });
    } else {
      setForm({ title: "", body: "" });
    }
  }, [editing]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (editing) {
        await updatePost(editing.id, form);
        toast.success("Пост обновлен");
      } else {
        await createPost(form);
        toast.success("Пост создан");
      }
      setEditing(null);
      setForm({ title: "", body: "" });
      fetchPosts({ page, limit });
    } catch (error) {
      console.error(error);
      toast.error("Не удалось сохранить пост");
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold text-white">Посты</h2>
        <p className="text-sm text-zinc-400">Новости и продвижение площадки</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-6"
      >
        <h3 className="text-lg font-semibold text-white">
          {editing ? "Редактирование поста" : "Новый пост"}
        </h3>
        <label className="flex flex-col gap-1 text-sm text-zinc-400">
          Заголовок
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-400">
          Содержание
          <textarea
            rows={6}
            value={form.body}
            onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
            className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            required
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-emerald-400"
          >
            {editing ? "Сохранить" : "Опубликовать"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded bg-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              Отменить
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-4">
        {posts.items.map((post) => (
          <article key={post.id} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
            <header className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                <span className="text-xs text-zinc-500">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(post)}
                  className="rounded bg-zinc-800 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-700"
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await deletePost(post.id);
                      toast.success("Пост удален");
                      fetchPosts({ page, limit });
                    } catch (error) {
                      console.error(error);
                      toast.error("Не удалось удалить пост");
                    }
                  }}
                  className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
                >
                  Удалить
                </button>
              </div>
            </header>
            <p className="mt-3 whitespace-pre-line text-sm text-zinc-300">{post.body}</p>
          </article>
        ))}
      </div>
      {loading && <div className="text-sm text-zinc-400">Загрузка...</div>}
    </section>
  );
}

export default AdminPostsPage;
