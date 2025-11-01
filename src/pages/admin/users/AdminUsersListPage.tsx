import { useEffect, useMemo, useState } from "react";
import { LuRefreshCw, LuTrash2 } from "react-icons/lu";

import PageTitle from "@/shared/components/PageTitle";
import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import { useAdmin } from "@/shared/hooks/useAdmin";
import type { UserRole } from "@/entities/user/types";

interface UserFormState {
  role: UserRole;
  status: string;
  isActive: boolean;
}

export default function AdminUsersListPage() {
  const { users, loadUsers, updateUser, removeUser, loading, error } = useAdmin();
  const [formState, setFormState] = useState<Record<string, UserFormState>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers().catch((err) => {
      setActionError(extractErrorMessage(err, "Не удалось загрузить пользователей"));
    });
  }, [loadUsers]);

  useEffect(() => {
    setFormState(
      users.reduce<Record<string, UserFormState>>((acc, user) => {
        acc[user.id] = {
          role: user.role,
          status: user.status ?? "",
          isActive: user.isActive ?? true,
        };
        return acc;
      }, {}),
    );
  }, [users]);

  const combinedError = useMemo(() => actionError ?? error, [actionError, error]);

  const handleRoleChange = (id: string, role: UserRole) => {
    setFormState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        role,
      },
    }));
  };

  const handleStatusChange = (id: string, status: string) => {
    setFormState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status,
      },
    }));
  };

  const handleActiveChange = (id: string, isActive: boolean) => {
    setFormState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isActive,
      },
    }));
  };

  const handleSave = async (id: string) => {
    const current = formState[id];
    if (!current) return;

    setSavingId(id);
    setActionError(null);
    try {
      await updateUser(id, {
        role: current.role,
        status: current.status || undefined,
        isActive: current.isActive,
      });
    } catch (err: unknown) {
      setActionError(extractErrorMessage(err, "Не удалось обновить пользователя"));
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить пользователя?")) {
      return;
    }

    setDeletingId(id);
    setActionError(null);
    try {
      await removeUser(id);
    } catch (err: unknown) {
      setActionError(extractErrorMessage(err, "Не удалось удалить пользователя"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <Seo title="Админка — Пользователи" description="Управление пользователями платформы." />
      <PageTitle>Пользователи</PageTitle>

      {combinedError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{combinedError}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0F1624]">
        <table className="min-w-full divide-y divide-white/10 text-sm text-white/80">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Имя</th>
              <th className="px-4 py-3 text-left">Контакты</th>
              <th className="px-4 py-3 text-left">Роль</th>
              <th className="px-4 py-3 text-left">Статус</th>
              <th className="px-4 py-3 text-left">Активен</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-white/60">
                  Загружаем пользователей…
                </td>
              </tr>
            ) : null}
            {users.map((user) => {
              const current = formState[user.id] ?? {
                role: user.role,
                status: user.status ?? "",
                isActive: user.isActive ?? true,
              };
              return (
                <tr key={user.id} className="align-top">
                  <td className="px-4 py-4 font-mono text-xs text-white/60">{user.id}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-white">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-white/60">{user.email ?? "—"}</span>
                      <span className="text-white/60">{user.phoneNumber ?? "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                      value={current.role}
                      onChange={(event) => handleRoleChange(user.id, event.target.value as UserRole)}
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                      value={current.status}
                      onChange={(event) => handleStatusChange(user.id, event.target.value)}
                      placeholder="Статус"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <label className="inline-flex items-center gap-2 text-xs text-white/70">
                      <input
                        type="checkbox"
                        checked={current.isActive}
                        onChange={(event) => handleActiveChange(user.id, event.target.checked)}
                        className="h-4 w-4 rounded border border-white/30 bg-white/10 text-primary focus:ring-primary"
                      />
                      <span>{current.isActive ? "Да" : "Нет"}</span>
                    </label>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                      <Button
                        onClick={() => handleSave(user.id)}
                        disabled={savingId === user.id}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
                      >
                        <LuRefreshCw className="h-4 w-4" />
                        {savingId === user.id ? "Сохраняем" : "Сохранить"}
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-100 transition hover:bg-red-500/20 disabled:opacity-60"
                      >
                        <LuTrash2 className="h-4 w-4" />
                        {deletingId === user.id ? "Удаляем" : "Удалить"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-white/60">
                  Пользователи не найдены.
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
