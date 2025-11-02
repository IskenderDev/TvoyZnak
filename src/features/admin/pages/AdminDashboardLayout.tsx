import { NavLink, Outlet } from "react-router-dom";

import { RequireRole } from "@/shared/components/RequireRole";
import { paths } from "@/shared/routes/paths";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded px-3 py-2 text-sm font-semibold transition ${
    isActive ? "bg-emerald-500 text-zinc-900" : "text-zinc-300 hover:bg-zinc-800"
  }`;

export function AdminDashboardLayout() {
  return (
    <RequireRole role="admin">
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-semibold text-white">Админ-панель</h1>
          <p className="text-sm text-zinc-400">
            Управление пользователями, объявлениями и постами
          </p>
        </header>
        <nav className="flex flex-wrap gap-2">
          <NavLink to={paths.admin.lots} className={navClass}>
            Объявления
          </NavLink>
          <NavLink to={paths.admin.users} className={navClass}>
            Пользователи
          </NavLink>
          <NavLink to={paths.admin.posts} className={navClass}>
            Посты
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </RequireRole>
  );
}

export default AdminDashboardLayout;
