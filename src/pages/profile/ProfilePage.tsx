import { Link } from "react-router-dom";
import {
  LuPhone,
  LuMail,
  LuMapPin,
  LuShieldCheck,
  LuSmartphone,
  LuBell,
  LuLogOut,
  LuPencil,
  LuClock3,
  LuHeart,
} from "react-icons/lu";

import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import { useAuth } from "@/shared/hooks/useAuth";
import { paths } from "@/shared/routes/paths";

const stats = [
  {
    label: "Активные объявления",
    value: "3",
    trend: "+1 за месяц",
  },
  {
    label: "Избранные номера",
    value: "12",
    trend: "4 новых",
  },
  {
    label: "Совершённые сделки",
    value: "27",
    trend: "98% успешно",
  },
];

const activities = [
  {
    title: "Новый отклик на объявление",
    description: "Покупатель интересуется номером А777АА 77",
    time: "15 минут назад",
  },
  {
    title: "Сделка завершена",
    description: "Номер К123КК 99 отмечен как проданный",
    time: "Вчера, 18:20",
  },
  {
    title: "Изменение условий",
    description: "Вы обновили цену номера В555ВВ 50",
    time: "2 дня назад",
  },
];

const savedNumbers = [
  {
    plate: "А777АА 77",
    region: "Москва",
    price: "1 850 000 ₽",
  },
  {
    plate: "Е999ЕЕ 97",
    region: "Московская область",
    price: "1 250 000 ₽",
  },
  {
    plate: "В555ВВ 50",
    region: "Тверь",
    price: "980 000 ₽",
  },
];

const securityOptions = [
  {
    icon: LuShieldCheck,
    title: "Двухфакторная защита",
    description: "Код подтверждения на телефон для каждой сделки",
    enabled: true,
  },
  {
    icon: LuSmartphone,
    title: "Уведомления в приложении",
    description: "Будьте в курсе запросов и обновлений",
    enabled: true,
  },
  {
    icon: LuBell,
    title: "Email-оповещения",
    description: "Получайте отчёты и новости на почту",
    enabled: false,
  },
];

const getInitials = (fullName?: string) => {
  if (!fullName) return "";
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <section className="py-16 text-white">
        <Seo title="Профиль — Знак отличия" description="Управление личной информацией и объявлениями." />
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-white/5 bg-[#0F1624] p-10 text-center">
          <LuShieldCheck className="h-12 w-12 text-primary" />
          <div className="space-y-2">
            <h1 className="text-3xl font-actay-wide uppercase">Профиль</h1>
            <p className="text-base text-white/70">
              Авторизуйтесь, чтобы управлять объявлениями, отслеживать сделки и получать персональные рекомендации.
            </p>
          </div>
          <Link
            to={paths.auth.login}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:opacity-90"
          >
            Войти в аккаунт
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo title="Профиль — Знак отличия" description="Управление личной информацией и объявлениями." />
      <section className="space-y-10 py-10 text-white md:space-y-12 md:py-16">
        <header className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#0F1624] via-[#10253F] to-[#0B1220] p-6 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-3xl font-bold text-white md:h-24 md:w-24">
                {getInitials(user.fullName)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Личный кабинет</p>
                <h1 className="text-3xl font-actay-wide uppercase md:text-4xl">{user.fullName}</h1>
                <p className="text-white/70">
                  Управляйте объявлениями, отслеживайте сделки и поддерживайте актуальность контактных данных.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                <LuPencil className="h-4 w-4" /> Редактировать профиль
              </Button>
              <Button
                onClick={logout}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-red-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-red-200 transition hover:bg-red-500/20"
              >
                <LuLogOut className="h-4 w-4" /> Выйти
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/5 bg-[#0F1624] p-6 md:p-8">
            <h2 className="mb-6 text-lg font-semibold uppercase tracking-wide text-white/80">Статистика</h2>
            <dl className="space-y-4">
              {stats.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <div>
                    <dt className="text-sm text-white/60">{item.label}</dt>
                    <dd className="text-2xl font-semibold text-white">{item.value}</dd>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-primary/80">{item.trend}</span>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/5 bg-[#0F1624] p-6 md:p-8">
            <h2 className="mb-5 text-lg font-semibold uppercase tracking-wide text-white/80">Контактная информация</h2>
            <dl className="space-y-4 text-sm text-white/80">
              <div className="flex items-center gap-3">
                <LuMail className="h-5 w-5 text-primary" />
                <div>
                  <dt className="text-xs uppercase tracking-widest text-white/50">Email</dt>
                  <dd className="text-base text-white">{user.email ?? "mail@example.com"}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LuPhone className="h-5 w-5 text-primary" />
                <div>
                  <dt className="text-xs uppercase tracking-widest text-white/50">Телефон</dt>
                  <dd className="text-base text-white">{user.phoneNumber ?? "+7 (900) 000-00-00"}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LuMapPin className="h-5 w-5 text-primary" />
                <div>
                  <dt className="text-xs uppercase tracking-widest text-white/50">Регион</dt>
                  <dd className="text-base text-white">Москва и область</dd>
                </div>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl border border-white/5 bg-[#0F1624] p-6 md:p-8">
            <h2 className="mb-5 text-lg font-semibold uppercase tracking-wide text-white/80">Безопасность</h2>
            <ul className="space-y-4 text-sm text-white/80">
              {securityOptions.map(({ icon: Icon, title, description, enabled }) => (
                <li key={title} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
                  <Icon className={`mt-1 h-5 w-5 ${enabled ? "text-primary" : "text-white/40"}`} />
                  <div>
                    <p className="text-base font-medium text-white">{title}</p>
                    <p className="text-xs uppercase tracking-widest text-white/50">{description}</p>
                  </div>
                  <span className={`ml-auto text-xs uppercase tracking-wide ${enabled ? "text-primary/80" : "text-white/40"}`}>
                    {enabled ? "Вкл" : "Выкл"}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-white/5 bg-[#0F1624] p-6 md:p-8">
            <h2 className="mb-5 text-lg font-semibold uppercase tracking-wide text-white/80">Активность</h2>
            <ul className="space-y-4 text-sm text-white/80">
              {activities.slice(0, 2).map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <LuClock3 className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-base font-medium text-white">{item.title}</p>
                    <p className="text-xs uppercase tracking-widest text-white/50">{item.description}</p>
                    <span className="text-xs text-white/40">{item.time}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="#activity" className="mt-6 inline-flex items-center text-xs uppercase tracking-widest text-primary hover:text-white">
              Смотреть всё
            </Link>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <article id="activity" className="rounded-3xl border border-white/5 bg-[#0F1624] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold uppercase tracking-wide text-white/80">Журнал действий</h2>
              <span className="text-xs uppercase tracking-widest text-white/40">Последние 14 дней</span>
            </div>
            <ul className="space-y-5 text-sm text-white/80">
              {activities.map((item) => (
                <li key={`${item.title}-${item.time}`} className="flex items-start gap-4 rounded-2xl bg-white/5 px-4 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <LuBell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-white">{item.title}</p>
                    <p className="text-xs uppercase tracking-widest text-white/50">{item.description}</p>
                    <span className="text-xs text-white/40">{item.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-white/5 bg-[#0F1624] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold uppercase tracking-wide text-white/80">Избранные номера</h2>
              <LuHeart className="h-5 w-5 text-primary" />
            </div>
            <ul className="space-y-4 text-sm text-white/80">
              {savedNumbers.map((item) => (
                <li key={item.plate} className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="text-lg font-semibold text-white">{item.plate}</p>
                  <p className="text-xs uppercase tracking-widest text-white/50">{item.region}</p>
                  <span className="text-sm text-primary">{item.price}</span>
                </li>
              ))}
            </ul>
            <Link to={paths.numbers} className="mt-6 inline-flex items-center text-xs uppercase tracking-widest text-primary hover:text-white">
              Перейти в каталог
            </Link>
          </article>
        </section>
      </section>
    </>
  );
}
