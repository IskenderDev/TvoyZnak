import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LuCircleUserRound } from "react-icons/lu";

import { paths } from "@/shared/routes/paths";
import Container from "@/shared/components/Container";
import Button from "@/shared/components/Button";
import LegacyModal from "@/shared/components/Modal";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const [sellOpen, setSellOpen] = useState(false);
  const { user } = useAuth();

  const handleSellClick = () => {
    navigate(paths.sellNumber);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 font-medium text-[15px] ${
      isActive ? "text-[#85B6FF]" : "text-white hover:text-[#85B6FF]"
    }`;

  return (
    <header className="bg-gradient-to-r from-[#001833] via-[#003979] to-[#004899] font-actay font-light text-xl mb-12">
      <Container>
        <div className="flex items-center justify-between gap-4 p-5 md:p-10">
          <Link to={paths.home} className="shrink-0">
            <img src="/logo.svg" alt="Знак отличия" className="h-8 w-auto md:h-9" />
          </Link>

          <nav className="hidden items-center gap-7 md:flex xl:gap-9">
            <NavLink to={paths.home} end className={linkClass}>
              Главная
            </NavLink>
            <NavLink to={paths.about} className={linkClass}>
              О компании
            </NavLink>
            <NavLink to={paths.services} className={linkClass}>
              Услуги
            </NavLink>
            <NavLink to={paths.numbers} className={linkClass}>
              Номера
            </NavLink>
            <NavLink to={paths.news} className={linkClass}>
              Блог
            </NavLink>
            <NavLink to={paths.contacts} className={linkClass}>
              Контакты
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <Button
              onClick={handleSellClick}
              className="rounded-full bg-gradient-to-r from-[#0074FF] to-[#005CDB] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 md:px-4 md:text-[15px]"
            >
              Продать номер
            </Button>
            {user ? (
              <Link
                to={paths.profile}
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-left text-white transition hover:bg-white/20"
                aria-label="Открыть профиль"
              >
                <LuCircleUserRound className="h-6 w-6 text-white" />
                <span className="hidden text-sm font-medium md:block">
                  {user.fullName}
                </span>
              </Link>
            ) : (
              <Link
                to={paths.auth.login}
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-left text-white transition hover:bg-white/20"
              >
                <LuCircleUserRound className="h-6 w-6 text-white" />
                <span className="hidden text-sm font-medium md:block">Войти</span>
              </Link>
            )}
          </div>
        </div>
      </Container>

      <LegacyModal open={sellOpen} onClose={() => setSellOpen(false)} />
    </header>
  );
}
