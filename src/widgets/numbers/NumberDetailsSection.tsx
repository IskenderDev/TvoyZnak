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
  const [item, setItem] = useState<NumberItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoading(true)
    setError(null)

    numbersApi
      .get(id)
      .then((data) => {
        if (!mounted) return
        setItem(data)
      })
      .catch((err) => {
        if (!mounted) return
        const message = err?.response?.data?.message || err?.message || "Не удалось загрузить номер"
        setError(message)
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
      ...(contactPrefill.carNumber ? { carNumber: contactPrefill.carNumber } : {}),
      feedbackType: contactPrefill.feedbackType,
    }).toString()
    return params ? `?${params}` : ""
  }, [contactPrefill])

  const price = item ? formatPrice(item.price) : ""
  const publishedDate = item?.date ? new Date(item.date).toLocaleDateString("ru-RU") : ""
  const numberLabel = item ? formatPlateLabel(item) : ""

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#0B0B0C] text-white">
        <p className="text-neutral-300">Загрузка...</p>
      </section>
    )
  }
  if (error) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#0B0B0C] text-white">
        <p className="text-[#EB5757]">{error}</p>
      </section>
    )
  }
  if (!item) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#0B0B0C] text-white">
        <p className="text-neutral-300">Номер не найден</p>
      </section>
    )
  }

  const handleBuyClick = () => {
    navigate({ pathname: paths.contacts, search: contactSearch }, { state: { leadPrefill: contactPrefill } })
  }

  const sellerLogin = item.sellerLogin || item.seller || "—"
  const sellerName = item.sellerName || item.seller || "—"
  const phone = item.phone || "—"

  const detailsRows: Array<{ label: string; value: string; isPhone?: boolean }> = [
    { label: "Цена", value: price },
    { label: "Дата размещения", value: publishedDate || "—" },
    { label: "Логин", value: sellerLogin },
    { label: "Имя", value: sellerName },
    { label: "Телефон", value: phone, isPhone: !!item.phone },
  ]

  return (
    <>
      <Seo
        title={`Номер ${numberLabel || item.series} — Знак отличия`}
        description={`Предложение от ${item.seller}. Стоимость ${price}.`}
      />

      <section className=" -px-4 sm:px-6 lg:scroll-px-8  bg-[#0B0B0C] py-6 text-white">
        <div className="mx-auto w-full ">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <Link to={paths.home} > 
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Назад"
                className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#0177FF] hover:bg-[#0C8BFF]  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <LuArrowLeft className="h-6 w-6 text-white" />
              </button></Link>

            <h1 className="text-[30px] leading-tight sm:text-[36px] md:text-[42px] font-semibold">
              Продам номер <span className="font-auto-number uppercase tracking-wide">{numberLabel || item.series}</span>
            </h1>
          </div>

          <div className="mt-6 mx-auto text-center">
            <div className="flex items-center">
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
                showCaption={true}
                className="w-[320px] xs:w-[360px] sm:w-[520px] md:w-[640px] lg:w-[720px] mx-auto"
              />
            </div>

            <button
              onClick={handleBuyClick}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0177FF] px-25 md:px-50 py-3 text-base font-medium text-white transition hover:bg-[#0C8BFF]focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white mx-auto sm:mx-auto lg:mx-auto"
            >
              Купить
            </button>
          </div>

          <div className="mt-8 w-screen -ml-12   -mb-6">
            {detailsRows.map((row, index) => {
              const bg = index % 2 === 0 ? "bg-[#2C2C2C] " : "bg-transparent"
              return (
                <div
                  key={row.label}
                  className={`grid grid-cols-2 gap-5 items-center ${bg} px-10 py-1 sm:px-10 sm:py-2`}
                >
                  <div className="text-[18px] sm:text-[22px] md:text-[32px] font-semibold">{row.label}</div>
                  <div className="text-[18px] sm:text-[22px] md:text-[24px] text-white">
                    {row.isPhone ? (
                      <a href={`tel:${item.phone}`} className="hover:opacity-90">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
