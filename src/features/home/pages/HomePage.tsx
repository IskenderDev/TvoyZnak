import { Link } from "react-router-dom";

import { paths } from "@/shared/routes/paths";

export function HomePage() {
  return (
    <section className="flex flex-col gap-8 py-12">
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 via-zinc-900/40 to-zinc-950/80 p-10">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Площадка для продажи автомобильных номеров
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-300">
          Размещайте и покупайте эксклюзивные автомобильные номера. Мгновенная регистрация, прозрачная модерация и поддержка
          администраторов.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to={paths.carNumberLots.create}
            className="rounded bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-emerald-400"
          >
            Разместить объявление
          </Link>
          <Link
            to={paths.carNumberLots.root}
            className="rounded border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800"
          >
            Смотреть каталог
          </Link>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Прозрачная модерация",
            description: "Администратор проверяет объявления, корректирует цены и подтверждает публикацию.",
          },
          {
            title: "Контроль доступа",
            description: "Пользователи управляют своими лотами, администраторы — всей площадкой.",
          },
          {
            title: "Авто-регистрация",
            description: "Неавторизованный продавец может разместить лот и сразу получить аккаунт.",
          },
        ].map((card) => (
          <article key={card.title} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomePage;
