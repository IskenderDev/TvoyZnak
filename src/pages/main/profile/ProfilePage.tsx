import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuPlus } from "react-icons/lu";

import Seo from "@/shared/components/Seo";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { paths } from "@/shared/routes/paths";
import { numbersApi } from "@/shared/services/numbersApi";
import type { NumberItem } from "@/entities/number/types";
import { formatPrice } from "@/shared/lib/format";
import ProfileLayoutLikeCatalog, {
  type ProfileInfoField,
  type ProfileLotRow,
} from "@/components/profile/ProfileLayoutLikeCatalog";

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
      .listMy() // GET /api/car-number-lots/my
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

  // Продавец = всегда имя залогиненного пользователя
  const myLots = useMemo<NumberItem[]>(
    () => numbers.map((n) => ({ ...n, sellerName: user?.fullName ?? n.sellerName ?? n.seller })),
    [numbers, user?.fullName]
  );

  const visibleLots = useMemo(
    () => myLots.slice(0, Math.min(visibleCount, myLots.length)),
    [myLots, visibleCount],
  );

  const canShowMore = visibleCount < myLots.length;

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
      <>
        <Seo title="Профиль — Знак отличия" description="Управление личной информацией и объявлениями." />
        <section className="min-h-screen bg-[#0B0B0C] py-12 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h1 className="mb-6 text-3xl font-actay-wide uppercase md:text-4xl">Профиль</h1>
            <div className="mx-auto max-w-xl rounded-2xl bg-white px-10 py-12 text-center text-black shadow-sm">
              <h2 className="text-2xl font-actay-wide uppercase md:text-3xl">Требуется авторизация</h2>
              <p className="mt-3 text-sm text-black/70 md:text-base">
                Авторизуйтесь, чтобы увидеть свои данные и управлять объявлениями.
              </p>
              <Link
                to={paths.auth.login}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0177FF] px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:brightness-95"
              >
                Войти
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const profileFields: ProfileInfoField[] = [
    { label: "Имя", value: user.fullName || "—" },
    { label: "Email", value: user.email ?? "—" },
    { label: "Телефон", value: user.phoneNumber ?? "—" },
    { label: "Роль", value: formatRole(user.roles) },
  ];

  const lotRows: ProfileLotRow[] = visibleLots.map((item) => ({
    id: item.id,
    dateLabel: item.date ? formatDate(item.date) : "—",
    plate: {
      price: item.price,
      firstLetter: item.plate.firstLetter,
      secondLetter: item.plate.secondLetter,
      thirdLetter: item.plate.thirdLetter,
      firstDigit: item.plate.firstDigit,
      secondDigit: item.plate.secondDigit,
      thirdDigit: item.plate.thirdDigit,
      comment: item.plate.comment ?? item.description ?? "",
      regionId: Number(item.plate.regionId ?? item.region ?? 0) || 0,
    },
    priceLabel: formatPrice(item.price),
    sellerLabel: user.fullName || "—",
    onDelete: () => handleDelete(item.id),
    isDeleting: deletingId === item.id,
    deleteLabel: "Удалить",
    deletingLabel: "Удаляем…",
  }));

  const showMoreHandler = canShowMore ? () => setVisibleCount((prev) => prev + LIMIT_STEP) : undefined;

  return (
    <>
      <Seo title="Профиль — Знак отличия" description="Управление личной информацией и объявлениями." />
      <ProfileLayoutLikeCatalog
        pageTitle="Профиль"
        profileCard={{
          eyebrow: "Личный кабинет",
          title: user.fullName,
          description: "Здесь отображаются ваши данные и список добавленных номеров.",
          actions: (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center rounded-full border border-black/20 px-5 py-2 text-sm font-medium uppercase tracking-wide text-black transition hover:bg-black/5"
            >
              Выйти
            </button>
          ),
          fields: profileFields,
        }}
        lotsCard={{
          title: "Мои номера",
          subtitle: "Добавляйте, просматривайте и удаляйте объявления.",
          headerActions: (
            <Link
              to={paths.sellNumber}
              className="inline-flex items-center gap-2 rounded-full bg-[#0177FF] px-5 py-2 text-sm font-medium uppercase tracking-wide text-white transition hover:brightness-95"
            >
              <LuPlus className="h-4 w-4" /> Добавить номер
            </Link>
          ),
          items: lotRows,
          loading,
          loadingLabel: "Загружаем список номеров…",
          error,
          emptyLabel: "У вас пока нет добавленных номеров.",
          canShowMore,
          onShowMore: showMoreHandler,
          showMoreLabel: "Показать ещё",
        }}
      />
    </>
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
  if (typeof error === "string" && error.trim()) return error;

  if (error && typeof error === "object") {
    const withMessage = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown } };
    };

    const responseMessage = withMessage.response?.data?.message;
    const responseError = withMessage.response?.data?.error;
    const message = withMessage.message;

    if (typeof responseMessage === "string" && responseMessage.trim()) return responseMessage;
    if (typeof responseError === "string" && responseError.trim()) return responseError;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
};
