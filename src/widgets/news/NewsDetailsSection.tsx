import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Seo from "@/shared/components/Seo"
import NewsCard from "@/shared/components/NewsCard"
import { newsApi } from "@/shared/services/newsApi"
import type { NewsItem } from "@/entities/news/types"

const PER_PAGE = 6

export default function NewsDetailsSection() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<NewsItem | null>(null)
  const [related, setRelated] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoading(true)
    setError(null)

    Promise.all([newsApi.get(id), newsApi.list({})])
      .then(([current, list]) => {
        if (!mounted) return
        setItem(current)
        const filtered = list
          .filter((news) => news.id !== current.id)
          .slice(0, PER_PAGE)
        setRelated(filtered)
      })
      .catch((err) => {
        if (!mounted) return
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Не удалось загрузить новость"
        setError(message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [id])

  const meta = useMemo(() => {
    if (!item) return { date: "", views: 0, dateTime: "" }
    const rawDate =
      (item as any).publishedAt ||
      (item as any).createdDate ||
      (item as any).updatedDate ||
      ""
    return {
      date: rawDate ? formatDateShort(rawDate) : "",
      dateTime: rawDate || "",
      views: (item as any)?.views ?? 0,
    }
  }, [item])


  if (loading) {
    return (
      <section className="bg-[#0B0B0C] text-white min-h-screen flex items-center justify-center">
        <p className="text-neutral-300">Загрузка…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-[#0B0B0C] text-white min-h-screen flex items-center justify-center">
        <p className="text-[#EB5757]">{error}</p>
      </section>
    )
  }

  if (!item) {
    return (
      <section className="bg-[#0B0B0C] text-white min-h-screen flex items-center justify-center">
        <p className="text-neutral-300">Новость не найдена</p>
      </section>
    )
  }

  return (
    <>
      <Seo
        title={`${item.title} — Знак отличия`}
        description={item.excerpt || item.content?.slice(0, 180)}
      />

      <section className="bg-[#0B0B0C] text-white min-h-screen">
        <div className="mx-auto max-w-9xl px-4 md:px-6 py-6">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-[#0177FF] hover:underline mb-6"
          >
            <span className="-mt-[1px]">←</span> Все новости
          </Link>

          <article className=" overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-0">
              {item.cover ? (
                <div className="lg:w-[46%] relative">
                  <img
                    src={item.cover}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover aspect-[16/9] lg:aspect-auto lg:h-[420px]"
                  />
                </div>
              ) : null}

              <div className="flex-1 p-6 md:p-8">
                {meta.date && (
                  <time dateTime={meta.dateTime} className="inline-block text-lg text-neutral-400 mb-4">
                    {meta.date}
                  </time>
                )}

                <h1 className="uppercase font-extrabold tracking-wide leading-tight text-white text-[26px] md:text-[34px] mb-4">
                  {item.title}
                </h1>

                {item.excerpt && (
                  <p className="mb-6 text-[15px] md:text-2xl">
                    {item.excerpt}
                  </p>
                )}
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <>
              <h2 className="text-[28px] md:text-[34px] font-extrabold mt-12 md:mt-16 mb-6">
                Другие новости
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}


const formatDateShort = (value: string): string => {
  const d = new Date(value)
  if (Number.isNaN(+d)) return ""
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

