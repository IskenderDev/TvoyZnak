import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LuCircleUserRound } from "react-icons/lu";

import { paths } from "@/shared/routes/paths";
import Container from "@/shared/components/Container";
import Button from "@/shared/components/Button";
import LegacyModal from "@/shared/components/Modal";
import RegisterModal from "@/features/auth/RegisterModal";

export default function Header() {
  const navigate = useNavigate();
  const [sellOpen, setSellOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  const handleSellClick = () => {
    navigate(paths.sellNumber);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 font-medium text-[15px] ${
      isActive ? "text-primary-200" : "text-foreground hover:text-primary-200"
    }`;

  return (
    <header className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 font-actay font-light text-xl text-foreground mb-12">
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
              className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 md:px-4 md:text-[15px]"
            >
              Продать номер
            </Button>
            <button
              type="button"
              onClick={() => setRegisterOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isRegisterOpen}
            >
              <LuCircleUserRound className="h-8 w-8 text-foreground" />
            </button>
          </div>
        </div>
      </Container>

      <LegacyModal open={sellOpen} onClose={() => setSellOpen(false)} />

      <RegisterModal open={isRegisterOpen} onClose={() => setRegisterOpen(false)} />
    </header>
  );
}
