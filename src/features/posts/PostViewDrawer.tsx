import { useMemo } from "react";

import Modal from "@/shared/ui/Modal";
import Button from "@/shared/ui/Button";
import Spinner from "@/shared/ui/Spinner";
import ErrorState from "@/shared/ui/ErrorState";
import type { Post } from "@/entities/post/types";
import { usePostQuery } from "@/entities/post/hooks";

export type PostViewDrawerProps = {
  open: boolean;
  post?: Post | null;
  postId?: string | null;
  onClose: () => void;
  onEdit: (post: Post) => void;
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function PostViewDrawer({
  open,
  post,
  postId,
  onClose,
  onEdit,
}: PostViewDrawerProps) {
  const effectiveId = postId ?? post?.id ?? null;
  const { data, isLoading, isError, refetch } = usePostQuery(
    effectiveId ?? "",
    open && Boolean(effectiveId),
  );

  const currentPost = data ?? post ?? null;

  const createdAt = useMemo(
    () => formatDateTime(currentPost?.createdAt),
    [currentPost?.createdAt],
  );

  const updatedAt = useMemo(
    () => formatDateTime(currentPost?.updatedAt),
    [currentPost?.updatedAt],
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl sm:max-w-xl">
        {isLoading && !currentPost ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-slate-500">
            <Spinner />
            <span>Загружаем пост...</span>
          </div>
        ) : null}

        {isError ? (
          <ErrorState
            title="Не удалось загрузить пост"
            onRetry={() => void refetch()}
          />
        ) : null}

        {currentPost ? (
          <div className="flex flex-col gap-6">
            <header className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {currentPost.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Создано: {createdAt}
                    <br />Обновлено: {updatedAt}
                  </p>
                </div>
                <Button onClick={() => onEdit(currentPost)}>Редактировать</Button>
              </div>
            </header>

            {currentPost.imageUrl ? (
              <img
                src={currentPost.imageUrl}
                alt={currentPost.title}
                className="w-full rounded-3xl object-cover shadow-sm"
              />
            ) : null}

            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Описание</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {currentPost.description}
              </p>
            </section>

            <footer className="flex justify-end">
              <Button variant="ghost" onClick={onClose}>
                Закрыть
              </Button>
            </footer>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
