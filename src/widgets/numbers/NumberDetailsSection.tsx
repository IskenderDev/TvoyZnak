import { useEffect, useMemo, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import Seo from "@/shared/components/Seo";
import PlateStaticLg from "@/shared/components/plate/PlateStaticLg";
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

  const contactPrefill = useMemo(() => {
    if (!item) {
      return { carNumber: "", feedbackType: "buy" as const };
    }

    return buildContactPrefill(item);
  }, [item]);

  const contactSearch = useMemo(() => {
    const params = createSearchParams({
      ...(contactPrefill.carNumber ? { carNumber: contactPrefill.carNumber } : {}),
      feedbackType: contactPrefill.feedbackType,
    }).toString();

    return params ? `?${params}` : "";
  }, [contactPrefill]);

  const price = item ? formatPrice(item.price) : "";
  const publishedDate = item?.date ? new Date(item.date).toLocaleDateString("ru-RU") : "";
  const numberLabel = item ? formatPlateLabel(item) : "";

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#05070D] text-white">
        <p className="text-neutral-300">Загрузка...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#05070D] text-white">
        <p className="text-[#EB5757]">{error}</p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#05070D] text-white">
        <p className="text-neutral-300">Номер не найден</p>
      </section>
    );
  }

  const handleBuyClick = () => {
    navigate(
      {
        pathname: paths.contacts,
        search: contactSearch,
      },
      { state: { leadPrefill: contactPrefill } },
    );
  };

  const sellerLogin = item.sellerLogin || item.seller || "—";
  const sellerName = item.sellerName || item.seller || "—";
  const phone = item.phone || "—";

  const detailsRows: Array<{ label: string; value: string }> = [
    { label: "Цена", value: price },
    { label: "Дата размещения", value: publishedDate || "—" },
    { label: "Логин", value: sellerLogin },
    { label: "Имя", value: sellerName },
    { label: "Телефон", value: phone },
  ];

  return (
    <>
      <Seo
        title={`Номер ${numberLabel || item.series} — Знак отличия`}
        description={`Предложение от ${item.seller}. Стоимость ${price}.`}
      />
      <section className="min-h-screen bg-[#05070D] py-12 text-white">
        <div className="mx-auto w-full px-4 sm:px-8 lg:px-12">
          <div className="overflow-hidden rounded-3xl bg-[#0B0D12] shadow-[0_24px_80px_rgba(1,8,28,0.45)]">
            <div className="bg-[#05070D] px-6 py-10 text-center sm:px-10 lg:px-16">
              <h1 className="text-2xl font-road font-semibold uppercase tracking-wide sm:text-3xl">
                Продам номер {numberLabel || item.series}
              </h1>

              <div className="mt-10 flex w-full items-center justify-center">
                <PlateStaticLg
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
                  className="w-full max-w-[880px] drop-shadow-[0_40px_120px_rgba(1,8,28,0.45)]"
                />
              </div>

              <button
                onClick={handleBuyClick}
                className="mt-10 inline-flex items-center justify-center rounded-full bg-[#0177FF] px-10 py-3 text-lg font-medium text-white transition hover:bg-[#0C8BFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Купить
              </button>
            </div>

            <dl className="bg-[#0B0D12]">
              {detailsRows.map((row, index) => {
                const rowTone = index % 2 === 0 ? "bg-white/5" : "bg-white/10";

                return (
                  <div
                    key={row.label}
                    className={`grid grid-cols-1 gap-2 px-6 py-5 text-left text-sm sm:grid-cols-[200px_1fr] sm:px-10 sm:text-base ${rowTone}`}
                  >
                    <dt className="font-road uppercase tracking-wide text-white/60">{row.label}</dt>
                    <dd className="text-white/90">
                      {row.label === "Телефон" && item.phone ? (
                        <a
                          href={`tel:${item.phone}`}
                          className="transition hover:text-white"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
