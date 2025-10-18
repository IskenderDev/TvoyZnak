import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { NEWS } from "@/app/data/news"
import Seo from "@/shared/components/Seo"
import NewsCard from '@/shared/components/NewsCard'
const PER_PAGE = 6
export default function NewsDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState(1)
  const paged = NEWS.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const news = useMemo(() => NEWS.find((n) => n.slug === slug), [slug])

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0B0B0C] font-actay">
        Новость не найдена
      </div>
    )
  }

  return (
    <>
      <Seo title={`${news.title} — Знак отличия`} description={news.excerpt} />
      <Link to="/news" className="text-[#0177FF] hover:underline mx-6">← Все новости</Link>
      <article className="bg-[#0B0B0C] text-white min-h-screen py-8 font-actay">

        <div className=" mx-auto px-6 flex flex-col lg:flex-row gap-10">
          <img
            src={news.cover}
            alt={news.title}
            className="w-full lg:w-1/2 rounded-2xl object-cover"
          />

          <div className="flex-1">
            <p className="text-neutral-400 text-sm mb-2 flex items-center gap-2">
              {news.date} 
            </p>
            <h1 className="text-3xl md:text-4xl font-road font-bold mb-4 uppercase leading-snug">
              {news.title}
            </h1>
            <p className="text-neutral-300 leading-relaxed mb-6 font-road">{news.excerpt}</p>
            <div className="text-neutral-300 whitespace-pre-line leading-relaxed font-road">
              {news.content}
            </div>
          </div>
        </div>
        <div className="m-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paged.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </article>
    </>
  )
}
