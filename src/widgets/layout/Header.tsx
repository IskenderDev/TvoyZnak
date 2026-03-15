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

  // 🔥 функция обрезания имени
  const truncateName = (name: string, max = 7) => {
    const trimmed = name.trim()
    return trimmed.length > max ? `${trimmed.slice(0, max)}...` : trimmed
  }

  const userRoles = user?.roles?.length
    ? user.roles
    : user?.role
    ? [user.role]
    : []

  const isAdmin = userRoles.includes("admin")
  const userDestination = isAdmin ? paths.admin.lots : paths.profile

  const handleSellClick = useCallback(() => {
    navigate(paths.sellNumber)
  }, [navigate])

  const handleLoginClick = useCallback(() => {
    openLogin({
      redirectTo:
        `${location.pathname}${location.search}${location.hash}` ||
        paths.profile,
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
        mx-3 desktop:mx-4 desktop:mx-5
        text-white
        overflow-hidden
      "
    >
      <Container>
        <div
          className="
            relative
            flex items-center justify-between
            gap-3 desktop:gap-5 desktop:gap-5
            py-3 desktop:py-4 desktop:py-6
          "
        >
          <Link
            to={paths.home}
            onClick={handleLogoClick}
            className="shrink-0 inline-flex items-center"
          >
            <img
              src="/logo.svg"
              alt="Знак отличия"
              className="h-7 w-auto desktop:h-8 desktop:h-9"
            />
          </Link>

          <div className="hidden flex-1 justify-center desktop:flex">
            <div className="nav-glass inline-flex items-center px-4 desktop:px-5">
              <HeaderNav />
            </div>
          </div>

          <div className="flex items-center gap-2 desktop:gap-3 desktop:gap-4">
            <button
              type="button"
              onClick={openMenu}
              className="
                flex desktop:hidden
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

            <div className="hidden items-center gap-2 desktop:gap-3 desktop:flex">
              <Button
                onClick={handleSellClick}
                className="
                  rounded-full
                  bg-[#0075ff]
                  px-4 desktop:px-5
                  py-2 desktop:py-2.5
                  text-sm font-semibold
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
                    flex items-center gap-1 desktop:gap-1
                    rounded-full
                    bg-white/5
                    px-2 desktop:px-3
                    py-2
                    text-[14px]
                    ring-1 ring-white/10
                    backdrop-blur-xl
                    transition
                    font-[400]
                    hover:bg-white/10
                    max-w-[220px]
                    mr-2
                  "
                >
                  <LuCircleUserRound className="h-5 w-5 shrink-0" />
                  <span className="hidden desktop:block">
                    {truncateName(user?.fullName ?? "", 7)}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="
                    flex items-center gap-1.5 desktop:gap-2
                    rounded-full
                    bg-white/5
                    px-2.5 desktop:px-3
                    py-1.5
                    text-xs desktop:text-sm
                    ring-1 ring-white/10
                    backdrop-blur-xl
                    transition
                    hover:bg-white/10
                    mr-2
                  "
                >
                  <LuCircleUserRound className="h-5 w-5" />
                  <span className="hidden desktop:block text-sm font-medium">
                    Войти
                  </span>
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
