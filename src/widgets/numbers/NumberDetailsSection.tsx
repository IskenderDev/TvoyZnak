import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Seo from "@/shared/components/Seo";
import PlateStaticSm from "@/shared/components/plate/PlateStaticSm";
import { formatPrice } from "@/shared/lib/format";
import { numbersApi } from "@/shared/services/numbersApi";
import type { NumberItem } from "@/entities/number/types";

export default function NumberDetailsSection() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<NumberItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <section className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <p className="text-neutral-300">Загрузка...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <p className="text-danger">{error}</p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <p className="text-neutral-300">Номер не найден</p>
      </section>
    );
  }

  const price = formatPrice(item.price);
  const publishedDate = item.date ? new Date(item.date).toLocaleDateString("ru-RU") : "";

  return (
    <>
      <Seo title={`Номер ${item.series} — Знак отличия`} description={`Предложение от ${item.seller}. Стоимость ${price}.`} />
      <section className="bg-background text-foreground min-h-screen py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 md:flex-row">
          <div className="flex-1 rounded-2xl bg-surface p-6 shadow-lg">
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

            <dl className="mt-6 space-y-2 text-sm text-neutral-300">
              <div className="flex justify-between">
                <dt className="font-semibold text-foreground">Стоимость:</dt>
                <dd>{price}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-semibold text-foreground">Регион:</dt>
                <dd>{item.region || item.plate.regionId}</dd>
              </div>
              {publishedDate && (
                <div className="flex justify-between">
                  <dt className="font-semibold text-foreground">Добавлен:</dt>
                  <dd>{publishedDate}</dd>
                </div>
              )}
              {item.status && (
                <div className="flex justify-between">
                  <dt className="font-semibold text-foreground">Статус:</dt>
                  <dd className="uppercase">{item.status}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex-1 rounded-2xl bg-surface p-6 shadow-lg">
            <h2 className="text-2xl font-road font-bold uppercase">Информация о продавце</h2>
            <p className="mt-3 text-neutral-300">{item.seller}</p>
            {item.phone && <p className="mt-1 text-neutral-400">Телефон: {item.phone}</p>}

            {item.description && (
              <div className="mt-6 rounded-xl bg-background p-4 text-neutral-300">
                <h3 className="text-lg font-road font-semibold uppercase text-foreground">Описание</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{item.description}</p>
              </div>
            )}

            <button className="mt-8 w-full rounded-full bg-primary-500 px-6 py-3 text-lg font-medium text-primary-foreground transition hover:bg-primary-600">
              Связаться
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
