import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { paths } from "@/shared/routes/paths";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded px-3 py-2 text-sm font-semibold transition hover:bg-zinc-800 ${
    isActive ? "bg-zinc-800 text-white" : "text-zinc-300"
  }`;

export function Header() {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(paths.auth.login);
  };

  return (
    <header className="bg-zinc-900 text-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to={paths.home} className="text-lg font-bold">
          TvoyZnak
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-2">
          <NavLink to={paths.carNumberLots.root} className={navLinkClass}>
            Все объявления
          </NavLink>
          <NavLink to={paths.carNumberLots.create} className={navLinkClass}>
            Разместить
          </NavLink>
          {isAuthenticated && (
            <NavLink to={paths.carNumberLots.mine} className={navLinkClass}>
              Мои объявления
            </NavLink>
          )}
          {role === "admin" && (
            <NavLink to={paths.admin.lots} className={navLinkClass}>
              Админка
            </NavLink>
          )}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded bg-zinc-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-600"
            >
              Выйти
            </button>
          ) : (
            <NavLink to={paths.auth.login} className={navLinkClass}>
              Войти
            </NavLink>
          )}
          {isAuthenticated && (
            <span className="ml-3 hidden text-sm text-zinc-300 sm:inline">
              {user?.fullName}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
