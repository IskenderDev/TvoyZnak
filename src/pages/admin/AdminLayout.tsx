import { NavLink, Outlet } from "react-router-dom";
import { paths } from "@/shared/routes/paths";
import PageTitle from "@/shared/components/PageTitle";

export default function AdminLayout() {
  const link = ({ isActive }: { isActive: boolean }) =>
    "px-3 py-2 rounded-md text-sm " + (isActive ? "bg-neutral-800" : "hover:bg-neutral-800");
  return (
    <div className="grid grid-cols-12 gap-6 mt-6">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2">
        <div className="sticky top-4 p-4 rounded-md bg-neutral-900 border border-neutral-800">
          <PageTitle>Админка</PageTitle>
          <nav className="flex flex-col gap-2">
            <NavLink to={paths.admin.lots} className={link}>
              Лоты номеров
            </NavLink>
            <NavLink to={paths.admin.numbers} className={link}>Номера</NavLink>
            <NavLink to={paths.admin.news} className={link}>Новости</NavLink>
          </nav>
        </div>
      </aside>
      <section className="col-span-12 md:col-span-9 lg:col-span-10">
        <Outlet />
      </section>
    </div>
  );
}
