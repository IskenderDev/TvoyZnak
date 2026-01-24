import { useCallback, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LuCircleUserRound, LuMenu } from "react-icons/lu"

import Button from "@/shared/components/Button"
import Container from "@/shared/components/Container"
import { useAuth } from "@/shared/lib/hooks/useAuth"
import { paths } from "@/shared/routes/paths"
import { useAuthModal } from "@/features/auth/lib/useAuthModal"

import HeaderNav from "./HeaderNav"
import MobileMenu from "./MobileMenu"

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { openLogin } = useAuthModal()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const userRoles = user?.roles?.length ? user.roles : user?.role ? [user.role] : []
  const isAdmin = userRoles.includes("admin")
  const userDestination = isAdmin ? paths.admin.lots : paths.profile

  const handleSellClick = useCallback(() => {
    navigate(paths.sellNumber)
  }, [navigate])

  const handleLoginClick = useCallback(() => {
    openLogin({
      redirectTo: `${location.pathname}${location.search}${location.hash}` || paths.profile,
    })
  }, [location.hash, location.pathname, location.search, openLogin])

  const handleLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (location.pathname === paths.home) {
        e.preventDefault()
        window.location.reload()
      }
    },
    [location.pathname]
  )

  const handleProfileClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (location.pathname === userDestination) {
        e.preventDefault()
        window.location.reload()
      }
    },
    [location.pathname, userDestination]
  )

  const openMenu = () => setIsMobileMenuOpen(true)
  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <header
      className="
        relative
        mx-3 sm:mx-4 lg:mx-5
        md:mb-10
        text-white
        overflow-hidden
      "
    >
  

      <Container>
        <div
          className="
            relative
            flex items-center justify-between
            gap-3 md:gap-5 lg:gap-8
            py-3 sm:py-4 lg:py-6
          "
        >
          {/* ЛОГО */}
          <Link
            to={paths.home}
            onClick={handleLogoClick}
            className="
              shrink-0
              inline-flex items-center
            "
          >
            <img
              src="/logo.svg"
              alt="Знак отличия"
              className="h-7 w-auto sm:h-8 lg:h-9"
            />
          </Link>

          {/* NAV — показываем с md и выше */}
          <div className="hidden flex-1 justify-center md:flex">
            <div
              className="
                nav-glass
                inline-flex items-center
                px-4 sm:px-5
                py-1.5
              "
            >
              <HeaderNav />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
            {/* burger — только на мобилках (< md) */}
            <button
              type="button"
              onClick={openMenu}
              className="
                flex md:hidden
                h-10 w-10 items-center justify-center
                rounded-full
                bg-white/5
                ring-1 ring-white/15
                backdrop-blur-xl
                transition
                hover:bg-white/10 hover:ring-white/30
              "
            >
              <LuMenu className="h-6 w-6" />
            </button>

            {/* Кнопки и профиль — с md и выше */}
            <div className="hidden items-center gap-2 sm:gap-3 md:flex">
              <Button
                onClick={handleSellClick}
                className="
                  rounded-full
                  bg-[#0075ff]
                  px-4 sm:px-5
                  py-2 sm:py-2.5
                  text-xs sm:text-sm font-semibold
                  transition
                  hover:bg-[#0063e6]
                  whitespace-nowrap
                "
              >
                Продать номер
              </Button>

              {user ? (
                <Link
                  to={userDestination}
                  onClick={handleProfileClick}
                  className="
                    flex items-center gap-1.5 sm:gap-2
                    rounded-full
                    bg-white/5
                    px-2.5 sm:px-3
                    py-1.5
                    text-xs sm:text-sm
                    ring-1 ring-white/10
                    backdrop-blur-xl
                    transition
                    hover:bg-white/10
                    max-w-[220px]
                  "
                >
                  <LuCircleUserRound className="h-5 w-5 shrink-0" />
                  <span
                    className="
                      hidden lg:block
                      truncate
                    "
                  >
                    {user.fullName}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="
                    flex items-center gap-1.5 sm:gap-2
                    rounded-full
                    bg-white/5
                    px-2.5 sm:px-3
                    py-1.5
                    text-xs sm:text-sm
                    ring-1 ring-white/10
                    backdrop-blur-xl
                    transition
                    hover:bg-white/10
                  "
                >
                  <LuCircleUserRound className="h-5 w-5" />
                  <span className="hidden lg:block">Войти</span>
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
        menuId="mobile-menu"
        onLoginClick={handleLoginClick}
      />
    </header>
  )
}
