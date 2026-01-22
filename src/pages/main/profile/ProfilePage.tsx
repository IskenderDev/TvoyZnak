import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuPlus } from "react-icons/lu";

import Seo from "@/shared/components/Seo";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { paths } from "@/shared/routes/paths";
import { numbersApi } from "@/shared/services/numbersApi";
import type { NumberItem } from "@/entities/number/types";
import { formatPrice } from "@/shared/lib/format";
import ProfileLayoutLikeCatalog, { type ProfileLotRow } from "@/components/profile/ProfileLayoutLikeCatalog";
import { formatRegionCode } from "@/shared/lib/plate";
import EditNumberModal from "@/components/profile/EditNumberModal";

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
  const [editingLotId, setEditingLotId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const myLots = useMemo<NumberItem[]>(
    () => numbers.map((n) => ({ ...n, sellerName: user?.fullName ?? n.sellerName ?? n.seller })),
    [numbers, user?.fullName]
  );

  const visibleLots = useMemo(
    () => myLots.slice(0, Math.min(visibleCount, myLots.length)),
    [myLots, visibleCount],
  );

  const canShowMore = visibleCount < myLots.length;

  const editingLot = useMemo(
    () => (editingLotId ? numbers.find((item) => item.id === editingLotId) ?? null : null),
    [editingLotId, numbers],
  );

  const openEditModal = (id: string) => {
    setEditingLotId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingLotId(null);
  };

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
        <section className="min-h-screen py-12 text-white">
          <div className="mx-auto w-full px-4 sm:px-6">
            <h1 className="mb-6 text-3xl uppercase md:text-4xl">Профиль</h1>
            <div className="mx-auto max-w-xl rounded-2xl bg-white px-10 py-12 text-center text-black shadow-sm">
              <h2 className="text-2xl uppercase md:text-3xl">Требуется авторизация</h2>
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
      regionId: formatRegionCode(item.plate.regionId || item.region || ""),
    },
    priceLabel: formatPrice(item.price),
    sellerLabel: user.fullName || "—",
    onDelete: () => handleDelete(item.id),
    isDeleting: deletingId === item.id,
    deleteLabel: "Удалить",
    deletingLabel: "Удаляем…",
    onEdit: () => openEditModal(item.id),
    editLabel: "Изменить номер",
  }));

  const showMoreHandler = canShowMore ? () => setVisibleCount((prev) => prev + LIMIT_STEP) : undefined;

  return (
    <>
      <Seo title="Профиль — Знак отличия" description="Управление личной информацией и объявлениями." />
      <EditNumberModal
        open={isEditModalOpen && Boolean(editingLot)}
        lot={editingLot}
        onClose={closeEditModal}
        onUpdated={(updated) => {
          setNumbers((prev) => prev.map((lot) => (lot.id === updated.id ? updated : lot)));
        }}
      />
      <ProfileLayoutLikeCatalog
        pageTitle="Профиль"
        profileCard={{
          eyebrow: "Личный кабинет",
          title: user.fullName,
          actions: (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center rounded-full border border-black/20 px-5 py-2 text-sm font-medium uppercase tracking-wide text-black transition hover:bg-black/5"
            >
              Выйти
            </button>
          ),
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
