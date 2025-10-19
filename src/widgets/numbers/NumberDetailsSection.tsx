import { useEffect, useMemo, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import Seo from "@/shared/components/Seo";
import PlateStaticSm from "@/shared/components/plate/PlateStaticSm";
import { formatPrice } from "@/shared/lib/format";
import { buildContactPrefill, formatPlateLabel } from "@/shared/lib/plate";
import { paths } from "@/shared/routes/paths";
import { numbersApi } from "@/shared/services/numbersApi";
import type { NumberItem } from "@/entities/number/types";

export default function NumberDetailsSection() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<NumberItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    numbersApi
      .get(id)
      .then((data) => {
        if (!mounted) return;
        setItem(data);
      })
      .catch((err) => {
        if (!mounted) return;
        const message = err?.response?.data?.message || err?.message || "Не удалось загрузить номер";
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="bg-[#0B0B0C] text-white min-h-screen flex items-center justify-center">
        <p className="text-neutral-300">Загрузка...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#0B0B0C] text-white min-h-screen flex items-center justify-center">
        <p className="text-[#EB5757]">{error}</p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="bg-[#0B0B0C] text-white min-h-screen flex items-center justify-center">
        <p className="text-neutral-300">Номер не найден</p>
      </section>
    );
  }

  const price = formatPrice(item.price);
  const publishedDate = item.date ? new Date(item.date).toLocaleDateString("ru-RU") : "";
  const numberLabel = formatPlateLabel(item);
  const contactPrefill = useMemo(() => buildContactPrefill(item), [item]);
  const contactSearch = useMemo(() => {
    const params = createSearchParams({
      ...(contactPrefill.carNumber ? { carNumber: contactPrefill.carNumber } : {}),
      feedbackType: contactPrefill.feedbackType,
    }).toString();

    return params ? `?${params}` : "";
  }, [contactPrefill]);

  const handleBuyClick = () => {
    navigate(
      {
        pathname: paths.contacts,
        search: contactSearch,
      },
      { state: { leadPrefill: contactPrefill } },
    );
  };

  return (
    <>
      <Seo
        title={`Номер ${numberLabel || item.series} — Знак отличия`}
        description={`Предложение от ${item.seller}. Стоимость ${price}.`}
      />
      <section className="bg-[#0B0B0C] text-white min-h-screen py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 md:flex-row">
          <div className="flex-1 rounded-2xl bg-[#111214] p-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-road font-bold uppercase text-white md:text-3xl">
                {numberLabel ? `Госномер ${numberLabel}` : `Объявление №${item.id}`}
              </h1>
              {publishedDate && (
                <time className="text-sm text-neutral-400" dateTime={item.date}>
                  {publishedDate}
                </time>
              )}
            </div>

            <PlateStaticSm
              data={{
                price: item.price,
                comment: item.plate.comment ?? item.description ?? "",
                firstLetter: item.plate.firstLetter,
                secondLetter: item.plate.secondLetter,
                thirdLetter: item.plate.thirdLetter,
                firstDigit: item.plate.firstDigit,
                secondDigit: item.plate.secondDigit,
                thirdDigit: item.plate.thirdDigit,
                regionId: item.plate.regionId,
              }}
              responsive
              showCaption={false}
              className="mx-auto"
            />

            <dl className="mt-6 grid gap-3 text-sm text-neutral-300 md:grid-cols-2">
              <div className="flex flex-col gap-1 rounded-xl bg-[#0B0B0C] px-4 py-3">
                <dt className="font-semibold text-white">Стоимость</dt>
                <dd>{price}</dd>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-[#0B0B0C] px-4 py-3">
                <dt className="font-semibold text-white">Регион</dt>
                <dd>{item.region || item.plate.regionId}</dd>
              </div>
              {item.category && (
                <div className="flex flex-col gap-1 rounded-xl bg-[#0B0B0C] px-4 py-3">
                  <dt className="font-semibold text-white">Категория</dt>
                  <dd className="uppercase tracking-wide">{item.category}</dd>
                </div>
              )}
              {item.status && (
                <div className="flex flex-col gap-1 rounded-xl bg-[#0B0B0C] px-4 py-3">
                  <dt className="font-semibold text-white">Статус</dt>
                  <dd className="uppercase tracking-wide">{item.status}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex-1 rounded-2xl bg-[#111214] p-6 shadow-lg">
            <h2 className="text-2xl font-road font-bold uppercase">Информация о продавце</h2>
            <p className="mt-3 text-neutral-300">{item.seller}</p>
            {item.phone && (
              <a
                href={`tel:${item.phone}`}
                className="mt-1 inline-flex items-center text-neutral-200 transition hover:text-white"
              >
                Телефон: {item.phone}
              </a>
            )}

            <div className="mt-6 space-y-3 rounded-xl bg-[#0B0B0C] p-4 text-sm leading-relaxed text-neutral-300">
              <h3 className="text-lg font-road font-semibold uppercase text-white">Детали предложения</h3>
              <p>
                <span className="text-white">Госномер:</span> {numberLabel || item.series}
              </p>
              <p>
                <span className="text-white">Стоимость:</span> {price}
              </p>
              <p>
                <span className="text-white">ID объявления:</span> {item.id}
              </p>
            </div>

            {item.description && (
              <div className="mt-4 rounded-xl bg-[#0B0B0C] p-4 text-neutral-300">
                <h3 className="text-lg font-road font-semibold uppercase text-white">Описание</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{item.description}</p>
              </div>
            )}

            <button
              onClick={handleBuyClick}
              className="mt-8 w-full rounded-full bg-[#0177FF] px-6 py-3 text-lg font-medium text-white transition hover:bg-[#046FFF]"
            >
              Купить этот номер
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
