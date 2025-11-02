import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAdmin } from "@/features/admin/hooks/useAdmin";
import { usePagination } from "@/shared/hooks/usePagination";
import type { User, UserRole } from "@/shared/types";

const roles: UserRole[] = ["user", "admin"];

export function AdminUsersPage() {
  const { users, fetchUsers, updateUser, deleteUser, loading } = useAdmin();
  const { page, limit } = usePagination();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    fetchUsers({ page, limit });
  }, [fetchUsers, limit, page]);

  useEffect(() => {
    if (selectedUser) {
      setRole(selectedUser.role);
      setIsActive(selectedUser.isActive);
    }
  }, [selectedUser]);

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold text-white">Пользователи</h2>
        <p className="text-sm text-zinc-400">
          Управление ролями, блокировками и контактной информацией пользователей
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-800">
          <thead className="bg-zinc-900 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2 text-left">Имя</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Телефон</th>
              <th className="px-3 py-2 text-left">Роль</th>
              <th className="px-3 py-2 text-left">Статус</th>
              <th className="px-3 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-950/60 text-sm text-zinc-200">
            {users.items.map((user) => (
              <tr key={user.id}>
                <td className="px-3 py-2">{user.fullName}</td>
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2">{user.phoneNumber ?? "—"}</td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2">{user.isActive ? "Активен" : "Заблокирован"}</td>
                <td className="flex gap-2 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className="rounded bg-zinc-800 px-2 py-1 text-xs font-semibold text-white hover:bg-zinc-700"
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await deleteUser(user.id);
                        toast.success("Пользователь удален");
                        fetchUsers({ page, limit });
                      } catch (error) {
                        console.error(error);
                        toast.error("Не удалось удалить пользователя");
                      }
                    }}
                    className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.items.length === 0 && (
          <div className="p-4 text-center text-sm text-zinc-400">Пользователи не найдены</div>
        )}
      </div>
      {loading && <div className="text-sm text-zinc-400">Загрузка...</div>}

      {selectedUser && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Изменение пользователя</h3>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              Закрыть
            </button>
          </div>
          <form
            className="grid gap-4 md:grid-cols-3"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                await updateUser(selectedUser.id, { role, isActive });
                toast.success("Данные обновлены");
                setSelectedUser(null);
                fetchUsers({ page, limit });
              } catch (error) {
                console.error(error);
                toast.error("Не удалось обновить пользователя");
              }
            }}
          >
            <label className="flex flex-col gap-1 text-sm text-zinc-400">
              Роль
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-400">
              Статус
              <select
                value={isActive ? "active" : "inactive"}
                onChange={(event) => setIsActive(event.target.value === "active")}
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="active">Активен</option>
                <option value="inactive">Заблокирован</option>
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-emerald-400"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default AdminUsersPage;
