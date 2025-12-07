import { Link, NavLink } from "react-router-dom"
import { FaVk, FaTelegramPlane, FaWhatsapp } from "react-icons/fa"
import Container from "../../shared/components/Container"
import { paths } from "../../shared/routes/paths"

export default function Footer() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 font-[400] text-[14px] ${
      isActive ? "text-[#85B6FF]" : "text-white hover:text-[#85B6FF]"
    }`

  return (
    <footer className="bg-gradient-to-r from-[#001833] via-[#003979] to-[#004899] text-white p-10">
      <Container>
        <div className="grid gap-8 md:gap-18 md:grid-cols-[auto_1fr_auto] items-start mx-auto">
          {/* ЛОГОТИП */}
          <div className="flex flex-col items-start order-1 md:order-none">
            <div className="my-6 md:my-10">
              <Link to={paths.home} className="shrink-0">
                <img
                  src="/logo.svg"
                  alt="Знак отличия"
                  className="h-8 md:h-12 w-auto"
                />
              </Link>
            </div>
          </div>

          {/* ТЕЛЕФОН + СОЦСЕТИ (на мобилке идёт сразу после логотипа) */}
          <div className="flex flex-col items-start md:items-end gap-3 order-2 md:order-last">
            <a
              href="tel:+79959202090"
              className="text-xl md:text-3xl font-semibold text-white hover:text-[#85B6FF] transition-colors"
            >
              +7 (995) 920-20-90
            </a>
            <div className="flex gap-4 text-[22px]">
              <a
                href="#"
                className="hover:text-[#85B6FF] transition-colors"
                aria-label="VK"
              >
                <FaVk />
              </a>
              <a
                href="#"
                className="hover:text-[#85B6FF] transition-colors"
                aria-label="Telegram"
              >
                <FaTelegramPlane />
              </a>
              <a
                href="#" 
                className="hover:text-[#85B6FF] transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* МЕНЮ (на мобилке уходит вниз, как на скрине) */}
          <div className="grid grid-cols-2 gap-8 sm:gap-16 order-3 md:order-none">
            <div>
              <h4 className="text-[18px] font-medium mb-3">Основные</h4>
              <ul className="flex flex-col gap-2">
                <li><NavLink to={paths.home} className={linkClass}>Главная</NavLink></li>
                <li><NavLink to="/about" className={linkClass}>О компании</NavLink></li>
                <li><NavLink to="/numbers" className={linkClass}>Номера</NavLink></li>
                <li><NavLink to="/blog" className={linkClass}>Блог</NavLink></li>
                <li><NavLink to="/contacts" className={linkClass}>Контакты</NavLink></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[18px] font-medium mb-3">Услуги</h4>
              <ul className="flex flex-col gap-2">
                <li><NavLink to="/service/evaluation" className={linkClass}>Оценка вашего номера</NavLink></li>
                <li><NavLink to="/service/buyout" className={linkClass}>Быстрый выкуп номера</NavLink></li>
                <li><NavLink to="/service/sale" className={linkClass}>Продажа номеров «Знак Отличия»</NavLink></li>
                <li><NavLink to="/service/search" className={linkClass}>Поиск номера под ваш запрос</NavLink></li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
