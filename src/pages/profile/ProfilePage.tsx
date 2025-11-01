import { Link } from "react-router-dom";

import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import { useAuth } from "@/shared/hooks/useAuth";
import { paths } from "@/shared/routes/paths";

const formatRole = (role?: string) => {
  if (role === "admin") return "Администратор";
  if (role === "user") return "Пользователь";
  return "—";
};

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <dt className="text-xs uppercase tracking-wide text-white/40">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-white">{value || "—"}</dd>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <section className="py-16 text-white">
        <Seo title="Профиль — Знак отличия" description="Управление личной информацией и объявлениями." />
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#0F1624] px-10 py-12 text-center">
          <h1 className="text-3xl font-actay-wide uppercase">Профиль</h1>
          <p className="mt-3 text-sm text-white/70">
            Авторизуйтесь, чтобы увидеть свои данные и управлять объявлениями.
          </p>
          <Link
            to={paths.auth.login}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
          >
            Войти
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 text-white">
      <Seo title="Профиль — Знак отличия" description="Личная информация и управление аккаунтом." />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4">
        <div className="rounded-3xl border border-white/10 bg-[#0F1624] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Личный кабинет</p>
              <h1 className="mt-2 text-3xl font-actay-wide uppercase">{user.fullName}</h1>
              <p className="mt-3 text-sm text-white/60">
                Управляйте своей учетной записью и объявлениями из одного места.
              </p>
            </div>
            <Button
              onClick={() => {
                void logout();
              }}
              className="self-start rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              Выйти
            </Button>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <ProfileField label="Имя" value={user.fullName} />
            <ProfileField label="Email" value={user.email ?? "—"} />
            <ProfileField label="Телефон" value={user.phoneNumber ?? "—"} />
            <ProfileField label="Роль" value={formatRole(user.role)} />
          </dl>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0F1624] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-actay-wide uppercase">Мои объявления</h2>
              <p className="mt-1 text-sm text-white/60">Перейдите в раздел управления, чтобы посмотреть опубликованные лоты.</p>
            </div>
            <Link
              to={paths.myLots}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
            >
              Управлять объявлениями
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
