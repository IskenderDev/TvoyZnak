import { NavLink } from "react-router-dom";

import { paths } from "@/shared/routes/paths";

type Orientation = "horizontal" | "vertical";

interface HeaderNavItem {
  label: string;
  to: string;
  exact?: boolean;
}

const headerNavItems: HeaderNavItem[] = [
  { label: "Главная", to: paths.home, exact: true },
  { label: "О компании", to: paths.about },
  { label: "Услуги", to: paths.services },
  { label: "Номера", to: paths.numbers },
  { label: "Блог", to: paths.news },
  { label: "Контакты", to: paths.contacts },
];

interface HeaderNavProps {
  orientation?: Orientation;
  className?: string;
  onNavigate?: () => void;
}

export default function HeaderNav({
  orientation = "horizontal",
  className = "",
  onNavigate,
}: HeaderNavProps) {
  const containerBase =
    orientation === "horizontal"
      ? "flex items-center gap-7 xl:gap-9"
      : "flex flex-col gap-4";

  const linkBase =
    "relative flex items-center transition-colors duration-200 font-medium text-white hover:text-[#85B6FF]";

  const horizontalText = "text-[15px] justify-center";
  const verticalText = "text-base justify-start";
  const activeClass =
    orientation === "horizontal"
      ? "text-[#85B6FF] after:absolute after:-bottom-2 after:left-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:rounded-full after:bg-[#85B6FF]"
      : "text-[#85B6FF] font-semibold";

  return (
    <nav className={`${containerBase} ${className}`.trim()}>
      {headerNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              linkBase,
              orientation === "horizontal" ? horizontalText : verticalText,
              isActive ? activeClass : null,
            ]
              .filter(Boolean)
              .join(" ")
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
