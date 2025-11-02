import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuPlus, LuTrash2 } from "react-icons/lu";

import Seo from "@/shared/components/Seo";
import Button from "@/shared/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { paths } from "@/shared/routes/paths";
import { numbersApi } from "@/shared/services/numbersApi";
import type { NumberItem } from "@/entities/number/types";
import { formatPrice } from "@/shared/lib/format";
import PlateStaticSm from "@/shared/components/plate/PlateStaticSm";

const formatDate = (value: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const LIMIT_STEP = 6;

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [numbers, setNumbers] = useState<NumberItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(LIMIT_STEP);

  useEffect(() => {
    if (!user) {
      setNumbers([]);
      return;
    }

    let isActive = true;
    setLoading(true);
    setError(null);

    numbersApi
      .listMy()
      .then((data) => {
        if (!isActive) return;
        setNumbers(data);
      })
      .catch((err: unknown) => {
        if (!isActive) return;
        const message = extractErrorMessage(err, "Не удалось загрузить ваши номера");
        setError(message);
        setNumbers([]);
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    setVisibleCount(LIMIT_STEP);
  }, [numbers.length]);

  const visibleLots = useMemo(
    () => numbers.slice(0, Math.min(visibleCount, numbers.length)),
    [numbers, visibleCount],
  );

  const canShowMore = visibleCount < numbers.length;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await numbersApi.delete(id);
      setNumbers((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "Не удалось удалить номер");
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

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
      <Seo title="Профиль — Знак отличия" description="Управление личной информацией и объявлениями." />
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4">
        <div className="rounded-3xl border border-white/10 bg-[#0F1624] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Личный кабинет</p>
              <h1 className="mt-2 text-3xl font-actay-wide uppercase">{user.fullName}</h1>
              <p className="mt-3 text-sm text-white/60">
                Здесь отображаются ваши данные и список добавленных номеров.
              </p>
            </div>
            <Button
              onClick={logout}
              className="self-start rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              Выйти
            </Button>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <ProfileField label="Имя" value={user.fullName} />
            <ProfileField label="Email" value={user.email ?? "—"} />
            <ProfileField label="Телефон" value={user.phoneNumber ?? "—"} />
            <ProfileField label="Роль" value={formatRole(user.roles)} />
          </dl>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0F1624]">
          <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-actay-wide uppercase">Мои номера</h2>
              <p className="mt-1 text-sm text-white/60">Добавляйте, просматривайте и удаляйте объявления.</p>
            </div>
            <Link
              to={paths.sellNumber}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
            >
              <LuPlus className="h-4 w-4" /> Добавить номер
            </Link>
          </div>

          {error ? (
            <p className="px-6 py-4 text-sm text-red-200">{error}</p>
          ) : null}

          {loading ? (
            <p className="px-6 py-6 text-sm text-white/70">Загружаем список номеров…</p>
          ) : null}

          {!loading && visibleLots.length === 0 ? (
            <p className="px-6 py-6 text-sm text-white/70">У вас пока нет добавленных номеров.</p>
          ) : null}

          {visibleLots.length > 0 ? (
            <div className="flex flex-col gap-3 px-4 py-6">
              <div className="hidden text-xs uppercase tracking-wide text-white/40 md:grid md:grid-cols-[120px_minmax(0,1fr)_160px_180px_auto] md:px-2">
                <span>Дата</span>
                <span>Номер</span>
                <span>Цена</span>
                <span>Продавец</span>
                <span className="text-right">Действия</span>
              </div>
              {visibleLots.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 md:grid-cols-[120px_minmax(0,1fr)_160px_180px_auto] md:items-center"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase text-white/40 md:hidden">Дата</span>
                    <span>{item.date ? formatDate(item.date) : "—"}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase text-white/40 md:hidden">Номер</span>
                    <PlateStaticSm
                      data={{
                        price: item.price,
                        firstLetter: item.plate.firstLetter,
                        secondLetter: item.plate.secondLetter,
                        thirdLetter: item.plate.thirdLetter,
                        firstDigit: item.plate.firstDigit,
                        secondDigit: item.plate.secondDigit,
                        thirdDigit: item.plate.thirdDigit,
                        comment: item.plate.comment ?? item.description ?? "",
                        regionId: Number(item.plate.regionId ?? item.region ?? 0) || 0,
                      }}
                      showCaption={false}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase text-white/40 md:hidden">Цена</span>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase text-white/40 md:hidden">Продавец</span>
                    <span>{item.sellerName ?? item.seller ?? "—"}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-100 transition hover:bg-red-500/20 disabled:opacity-60"
                    >
                      <LuTrash2 className="h-4 w-4" />
                      {deletingId === item.id ? "Удаляем…" : "Удалить"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {canShowMore ? (
            <div className="border-t border-white/10 px-6 py-5 text-center">
              <Button
                onClick={() => setVisibleCount((prev) => prev + LIMIT_STEP)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                Показать еще
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

const formatRole = (roles?: string[] | string) => {
  const normalize = (value: string | undefined) => {
    if (!value) return "—";
    if (value === "admin") return "Администратор";
    if (value === "user") return "Пользователь";
    return value;
  };

  if (Array.isArray(roles)) {
    if (roles.length === 0) return "—";
    return roles.map((role) => normalize(role)).join(", ");
  }

  return normalize(roles);
};

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const withMessage = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown } };
    };

    const responseMessage = withMessage.response?.data?.message;
    const responseError = withMessage.response?.data?.error;
    const message = withMessage.message;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    if (typeof responseError === "string" && responseError.trim()) {
      return responseError;
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
};

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <dt className="text-xs uppercase tracking-wide text-white/40">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-white">{value || "—"}</dd>
    </div>
  );
}
