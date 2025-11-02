import { useEffect, useState } from "react";

import { apiService } from "@/shared/api/apiService";
import { usePagination } from "@/shared/hooks/usePagination";
import type { Post } from "@/shared/types";

export function PostsPage() {
  const { page, limit, next, prev } = usePagination();
  const [state, setState] = useState<{ items: Post[]; total: number; loading: boolean }>(
    { items: [], total: 0, loading: false },
  );

  useEffect(() => {
    setState((prev) => ({ ...prev, loading: true }));
    apiService.posts
      .list({ page, limit })
      .then((response) =>
        setState({ items: response.data, total: response.total, loading: false }),
      )
      .catch((error) => {
        console.error(error);
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, [limit, page]);

  const totalPages = Math.max(Math.ceil(state.total / limit), 1);

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold text-white">Новости площадки</h1>
        <p className="text-sm text-zinc-400">
          Актуальные обновления, акции и советы от команды TvoyZnak
        </p>
      </header>
      {state.loading ? (
        <div className="flex justify-center py-10">
          <span className="animate-pulse text-sm text-zinc-400">Загрузка...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {state.items.map((post) => (
            <article key={post.id} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
              <h2 className="text-2xl font-semibold text-white">{post.title}</h2>
              <span className="text-xs text-zinc-500">
                {new Date(post.createdAt).toLocaleString()}
              </span>
              <p className="mt-3 whitespace-pre-line text-sm text-zinc-300">{post.body}</p>
            </article>
          ))}
          {state.items.length === 0 && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 text-center text-sm text-zinc-400">
              Постов пока нет
            </div>
          )}
        </div>
      )}
      <footer className="flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={page === 1}
          onClick={prev}
          className="rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Назад
        </button>
        <span className="text-sm text-zinc-400">
          Страница {page} из {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={next}
          className="rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Вперед
        </button>
      </footer>
    </section>
  );
}

export default PostsPage;
