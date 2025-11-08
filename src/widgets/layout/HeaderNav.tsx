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
      : "flex flex-col gap-3";

  const linkBase =
    "rounded-xl px-3 py-2 font-medium text-slate-300 transition-colors duration-200 hover:text-white";
  const linkActive = "bg-white/10 text-white shadow";

  const horizontalText = "text-[15px]";
  const verticalText = "text-base w-full text-left";

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
              isActive ? linkActive : "",
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
