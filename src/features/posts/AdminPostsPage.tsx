import { useEffect, useMemo, useState } from "react";
import { FiArrowDown, FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";

import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import IconButton from "@/shared/ui/IconButton";
import Table from "@/shared/ui/Table";
import Spinner from "@/shared/ui/Spinner";
import EmptyState from "@/shared/ui/EmptyState";
import ErrorState from "@/shared/ui/ErrorState";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import type { Post, PostsListParams } from "@/entities/post/types";
import { useDeletePost, usePostsQuery } from "@/entities/post/hooks";
import PostFormModal from "./PostFormModal";
import PostViewDrawer from "./PostViewDrawer";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const PAGE_SIZE = 10;

export default function AdminPostsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const [isFormOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewPost, setViewPost] = useState<Post | null>(null);

  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = useMemo(() => {
    const sort: PostsListParams["sort"] =
      sortDirection === "asc" ? "createdAt.asc" : "createdAt.desc";

    return {
      page,
      size: PAGE_SIZE,
      search: debouncedSearch || undefined,
      sort,
    } satisfies PostsListParams;
  }, [debouncedSearch, page, sortDirection]);

  const { data, isLoading, isFetching, isError, refetch } = usePostsQuery(queryParams);

  const deleteMutation = useDeletePost();

  const items: Post[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const shownCount = items.length;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleCreate = () => {
    setFormMode("create");
    setSelectedPost(null);
    setFormOpen(true);
  };

  const handleEdit = (post: Post) => {
    setFormMode("update");
    setSelectedPost(post);
    setFormOpen(true);
  };

  const handleView = (post: Post) => {
    setViewPost(post);
    setViewOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      await deleteMutation.mutateAsync(postToDelete.id);
      setPostToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortToggle = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[320px] items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (isError) {
      return (
        <ErrorState
          title="Не удалось загрузить посты"
          onRetry={() => void refetch()}
        />
      );
    }

    if (items.length === 0) {
      return (
        <EmptyState
          title="Постов пока нет"
          description="Создайте первый пост, чтобы начать работать с контентом."
          action={
            <Button onClick={handleCreate}>
              <FiPlus className="h-4 w-4" />
              Создать пост
            </Button>
          }
        />
      );
    }

    return (
      <>
        <Table>
          <Table.Head>
            <Table.HeaderCell>Превью</Table.HeaderCell>
            <Table.HeaderCell>Заголовок</Table.HeaderCell>
            <Table.HeaderCell>Описание</Table.HeaderCell>
            <Table.HeaderCell>
              <div className="flex items-center gap-2">
                Дата создания
                <IconButton
                  label="Сменить сортировку"
                  onClick={handleSortToggle}
                  className={sortDirection === "asc" ? "rotate-180" : ""}
                >
                  <FiArrowDown className="h-4 w-4" />
                </IconButton>
              </div>
            </Table.HeaderCell>
            <Table.HeaderCell className="text-right">Действия</Table.HeaderCell>
          </Table.Head>
          <Table.Body>
            {items.map((post) => (
              <Table.Row key={post.id}>
                <Table.Cell>
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-400">
                      Нет фото
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <button
                    type="button"
                    className="text-left text-sm font-semibold text-slate-900 hover:text-blue-600"
                    onClick={() => handleView(post)}
                  >
                    {post.title}
                  </button>
                </Table.Cell>
                <Table.Cell>
                  <p
                    className="max-w-xl truncate text-sm text-slate-600"
                    title={post.description}
                  >
                    {post.description.slice(0, 120)}
                    {post.description.length > 120 ? "…" : ""}
                  </p>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm text-slate-600">
                    {formatDateTime(post.createdAt)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-2">
                    <IconButton label="Просмотр" onClick={() => handleView(post)}>
                      <FiEye className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Редактировать" onClick={() => handleEdit(post)}>
                      <FiEdit2 className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label="Удалить"
                      onClick={() => setPostToDelete(post)}
                      disabled={deleteMutation.isPending}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Table.Mobile>
          {items.map((post) => (
            <Table.Card key={post.id}>
              <div className="flex items-start gap-4">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-400">
                    Нет фото
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    className="text-left text-base font-semibold text-slate-900 hover:text-blue-600"
                    onClick={() => handleView(post)}
                  >
                    {post.title}
                  </button>
                  <p className="text-sm text-slate-600" title={post.description}>
                    {post.description.slice(0, 120)}
                    {post.description.length > 120 ? "…" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{formatDateTime(post.createdAt)}</span>
                <div className="flex items-center gap-2">
                  <IconButton label="Просмотр" onClick={() => handleView(post)}>
                    <FiEye className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Редактировать" onClick={() => handleEdit(post)}>
                    <FiEdit2 className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label="Удалить"
                    onClick={() => setPostToDelete(post)}
                    disabled={deleteMutation.isPending}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            </Table.Card>
          ))}
        </Table.Mobile>
      </>
    );
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-900">Посты</h1>
          <p className="text-sm text-slate-600">
            Управляйте публикациями: создавайте, редактируйте и удаляйте посты.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <FiPlus className="h-4 w-4" />
          Создать пост
        </Button>
      </header>

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по заголовку или описанию"
            wrapperClassName="md:max-w-sm"
          />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>
              Показано {shownCount} из {total}
            </span>
            {isFetching ? <Spinner size="sm" /> : null}
          </div>
        </div>

        {renderTable()}

        {items.length > 0 ? (
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
              >
                Назад
              </Button>
              <span className="text-sm text-slate-500">
                Страница {page} из {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages}
              >
                Вперёд
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      <PostFormModal
        open={isFormOpen}
        mode={formMode}
        post={formMode === "update" ? selectedPost : null}
        onClose={() => setFormOpen(false)}
      />

      <PostViewDrawer
        open={viewOpen}
        post={viewPost}
        onClose={() => setViewOpen(false)}
        onEdit={(post) => {
          setViewOpen(false);
          handleEdit(post);
        }}
      />

      <ConfirmDialog
        open={Boolean(postToDelete)}
        title="Удалить пост?"
        description="Это действие нельзя отменить. Пост будет удалён без возможности восстановления."
        confirmText="Удалить"
        onConfirm={handleDelete}
        onCancel={() => setPostToDelete(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
