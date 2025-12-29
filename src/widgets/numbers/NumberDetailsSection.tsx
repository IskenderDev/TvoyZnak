import { useEffect, useMemo, useState } from "react"
import { createSearchParams, Link, useNavigate, useParams } from "react-router-dom"
import { LuArrowLeft } from "react-icons/lu"
import Seo from "@/shared/components/Seo"
import PlateStaticLg from "@/shared/components/plate/PlateStaticLg"
import { formatPrice } from "@/shared/lib/format"
import { buildContactPrefill, formatPlateLabel } from "@/shared/lib/plate"
import { paths } from "@/shared/routes/paths"
import { numbersApi } from "@/shared/services/numbersApi"
import type { NumberItem } from "@/entities/number/types"

export default function NumberDetailsSection() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [item, setItem] = useState<NumberItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [id])

  useEffect(() => {
    if (!id) return
    let mounted = true

    setLoading(true)
    setError(null)

    numbersApi
      .get(id)
      .then((data) => {
        if (mounted) setItem(data)
      })
      .catch((err) => {
        if (!mounted) return
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Не удалось загрузить номер"
        )
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [id])

  const contactPrefill = useMemo(() => {
    if (!item) return { carNumber: "", feedbackType: "buy" as const }
    return buildContactPrefill(item)
  }, [item])

  const contactSearch = useMemo(() => {
    const params = createSearchParams({
      ...(contactPrefill.carNumber
        ? { carNumber: contactPrefill.carNumber }
        : {}),
      feedbackType: contactPrefill.feedbackType,
    }).toString()

    return params ? `?${params}` : ""
  }, [contactPrefill])

  if (loading) {
    return (
      <section className="flex min-h-screen-safe items-center justify-center bg-[#0B0B0C] text-white">
        <p className="text-neutral-300">Загрузка...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="flex min-h-screen-safe items-center justify-center bg-[#0B0B0C] text-white">
        <p className="text-[#EB5757]">{error}</p>
      </section>
    )
  }

  if (!item) {
    return (
      <section className="flex min-h-screen-safe items-center justify-center bg-[#0B0B0C] text-white">
        <p className="text-neutral-300">Номер не найден</p>
      </section>
    )
  }

  const price = formatPrice(item.price)
  const publishedDate = item.date
    ? new Date(item.date).toLocaleDateString("ru-RU")
    : "—"

  const numberLabel = formatPlateLabel(item)
  const sellerName = item.sellerName || item.seller || "—"
  const phone = item.phone || "—"

  const detailsRows = [
    { label: "Цена", value: price },
    { label: "Дата размещения", value: publishedDate },
    { label: "Имя", value: sellerName },
    { label: "Телефон", value: phone, isPhone: !!item.phone },
  ]

  const handleBuyClick = () => {
    navigate(
      { pathname: paths.contacts, search: contactSearch },
      { state: { leadPrefill: contactPrefill } }
    )
  }

  return (
    <>
      <Seo
        title={`Номер ${numberLabel || item.series} — Знак отличия`}
        description={`Предложение от ${sellerName}. Стоимость ${price}.`}
      />

      <section className="bg-[#0B0B0C] py-6 text-white">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-4 sm:gap-6">
            <Link to={paths.home}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Назад"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#0177FF] hover:bg-[#0C8BFF]"
              >
                <LuArrowLeft className="h-6 w-6 text-white" />
              </button>
            </Link>

            <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-semibold">
              Продам номер{" "}
              <span className="font-auto-number uppercase tracking-wide">
                {numberLabel || item.series}
              </span>
            </h1>
          </div>

          <div className="mt-6 text-center">
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
              showCaption
              className="mx-auto w-[320px] xs:w-[360px] sm:w-[520px] md:w-[640px] lg:w-[720px] max-w-full"
            />

            <button
              onClick={handleBuyClick}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0177FF] px-12 py-3 text-base font-medium hover:bg-[#0C8BFF]"
            >
              Купить
            </button>
          </div>
        </div>
      <div className="mt-10">
        {detailsRows.map((row, index) => {
          const bg = index % 2 === 0 ? "bg-[#2C2C2C]" : "bg-transparent"

          return (
            <div key={row.label} className={`${bg} w-full`}>
              <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full flex justify-center">
                  <div
                    className="
                      grid items-start
                      grid-cols-1 gap-4 py-4 sm:grid-cols-[minmax(160px,240px)_1fr] sm:items-center sm:gap-8
                    "
                  >
                    <div className="text-left text-[18px] sm:text-[22px] md:text-[28px] font-semibold">
                      {row.label}
                    </div>

                    <div className="text-left text-[18px] sm:text-[22px] md:text-[22px] overflow-x-hidden break-words">
                      {row.isPhone ? (
                        <a href={`tel:${item.phone}`} className="hover:opacity-90">
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>





      </section>
    </>
  )
}
