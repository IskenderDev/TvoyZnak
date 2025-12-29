import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuCircleUserRound, LuMenu } from "react-icons/lu";

import Button from "@/shared/components/Button";
import Container from "@/shared/components/Container";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { paths } from "@/shared/routes/paths";
import { useAuthModal } from "@/features/auth/lib/useAuthModal";

import HeaderNav from "./HeaderNav";
import MobileMenu from "./MobileMenu";

const MOBILE_MENU_ID = "mobile-navigation-panel";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRoles = user?.roles?.length ? user.roles : user?.role ? [user.role] : [];
  const isAdmin = userRoles.includes("admin");
  const userDestination = isAdmin ? paths.admin.lots : paths.profile;

  const handleSellClick = useCallback(() => {
    navigate(paths.sellNumber);
  }, [navigate]);

  const handleLoginClick = useCallback(() => {
    openLogin({ redirectTo: `${location.pathname}${location.search}${location.hash}` || paths.profile });
  }, [location.hash, location.pathname, location.search, openLogin]);

  // Обработчик клика на логотип
  const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === paths.home) {
      e.preventDefault();
      window.location.reload();
    }
  }, [location.pathname]);

  // Обработчик клика на профиль/админку
  const handleProfileClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === userDestination) {
      e.preventDefault();
      window.location.reload();
    }
  }, [location.pathname, userDestination]);

  const openMenu = () => setIsMobileMenuOpen(true);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="mb-12 bg-gradient-to-r from-[#001833] via-[#003979] to-[#004899] font-light text-xl">
      <Container>
        <div className="flex items-center justify-between gap-4 p-5 md:p-10">
          <Link 
            to={paths.home} 
            className="shrink-0"
            onClick={handleLogoClick}
          >
            <img src="/logo.svg" alt="Знак отличия" className="h-8 w-auto md:h-9 text-white" />
          </Link>

          <div className="hidden md:block">
            <HeaderNav />
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button
              type="button"
              onClick={openMenu}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:hidden"
              aria-label="Открыть меню"
              aria-controls={MOBILE_MENU_ID}
              aria-expanded={isMobileMenuOpen}
            >
              <LuMenu className="h-6 w-6" />
            </button>

            <div className="hidden items-center gap-3 md:flex md:gap-5">
              <Button
                onClick={handleSellClick}
                className="rounded-full bg-gradient-to-r from-[#0074FF] to-[#005CDB] px-3 py-2 text-[17px] font-[400] text-white transition hover:opacity-90 md:px-4 md:text-[16px]"
              >
                Продать номер
              </Button>
              {user ? (
                <Link
                  to={userDestination}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-left text-white transition hover:bg-white/20"
                  aria-label={isAdmin ? "Открыть админку" : "Открыть профиль"}
                  onClick={handleProfileClick}
                >
                  <LuCircleUserRound className="h-6 w-6 text-white" />
                  <span className="hidden text-md font-[400] md:block">{user.fullName}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-left text-white transition hover:bg-white/20"
                >
                  <LuCircleUserRound className="h-6 w-6 text-white" />
                  <span className="hidden text-sm font-medium md:block">Войти</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMenu}
        onSellClick={handleSellClick}
        user={user}
        onLoginClick={handleLoginClick}
        menuId={MOBILE_MENU_ID}
      />
    </header>
  );
}