import { Link, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { paths } from "@/shared/routes/paths"
import Container from "./Container"
import Button from "./Button"
import Modal from "./Modal"
import { LuCircleUserRound } from "react-icons/lu"

export default function Header() {
  const nav = useNavigate()
  const [sellOpen, setSellOpen] = useState(false)

  const handleSellClick = () => {
    nav(paths.sellNumber)
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 font-medium text-[15px] ${
      isActive
        ? "text-[#85B6FF]"
        : "text-white hover:text-[#85B6FF]"
    }`

  return (
    <header className="bg-gradient-to-r from-[#001833] via-[#003979] to-[#004899] font-actay font-light text-xl mb-12">
      <Container>
        <div className=" flex items-center justify-between p-5 md:p-10 gap-4">
          <Link to={paths.home} className="shrink-0">
            <img
              src="/logo.svg"
              alt="Знак отличия"
              className="h-8 md:h-9 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-7 xl:gap-9">
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
              className="rounded-full bg-gradient-to-r from-[#0074FF] to-[#005CDB] hover:opacity-90 text-white px-3 md:px-4 py-2 text-sm md:text-[15px] font-medium"
            >
              Продать номер
            </Button>
            <button type="button">
              <LuCircleUserRound color="white" className="w-8 h-8" />
            </button>
          </div>
        </div>
      </Container>

      <Modal open={sellOpen} onClose={() => setSellOpen(false)} />
    </header>
  )
}
