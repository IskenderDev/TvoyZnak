import { NavLink, Outlet } from "react-router-dom";

import { paths } from "@/shared/routes/paths";
import { useAuth } from "@/shared/lib/hooks/useAuth";

const navItems = [
  { to: paths.admin.lots, label: "Лоты" },
  { to: paths.admin.news, label: "Новости" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive ? "bg-white text-blue-600 shadow-sm" : "bg-white/10 text-white hover:bg-white/20"
    }`;

  return (
    <div className="space-y-10 py-6">
      <section className="-mx-4 rounded-3xl bg-gradient-to-r from-[#001833] via-[#003979] to-[#004899] px-4 py-8 text-white shadow-xl sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Панель администратора</p>
            <h1 className="text-2xl font-semibold">Управление контентом</h1>
            <p className="max-w-2xl text-sm text-white/80">
              Управляйте лотами и новостями — всё в одном месте с обновлённой панелью управления.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={getLinkClass}>
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Выйти
            </button>
          </nav>
        </div>
      </section>

      <section>
        <Outlet />
      </section>
    </div>
  );
}
