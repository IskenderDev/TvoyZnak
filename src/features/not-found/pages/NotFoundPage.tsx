import { Link } from "react-router-dom";

import { paths } from "@/shared/routes/paths";

export function NotFoundPage() {
  return (
    <section className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-5xl font-bold text-white">404</h1>
      <p className="text-sm text-zinc-400">Страница не найдена</p>
      <Link
        to={paths.home}
        className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-emerald-400"
      >
        На главную
      </Link>
    </section>
  );
}

export default NotFoundPage;
