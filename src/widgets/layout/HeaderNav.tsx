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
    "relative flex items-center font-[400] transition-colors duration-200";

  const horizontalText =
    "justify-center text-[15px] text-slate-100 hover:text-white px-1 py-1";
  const verticalText =
    "w-full justify-start pl-4 text-base py-1.5 text-slate-100 hover:text-white";

  const activeHorizontal =
    "text-white after:absolute after:-bottom-[1px] after:left-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:rounded-full after:bg-[#2F8DFF]";
  const activeVertical =
    "text-white font-semibold before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full before:bg-[#2F8DFF]";

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
              isActive
                ? orientation === "horizontal"
                  ? activeHorizontal
                  : activeVertical
                : "",
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
