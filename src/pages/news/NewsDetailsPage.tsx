import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { NEWS } from "@/data/news";
import Seo from "@/shared/components/Seo";

export default function NewsDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const news = useMemo(() => NEWS.find((n) => n.slug === slug), [slug]);

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0B0B0C] font-actay">
        Новость не найдена
      </div>
    );
  }

  return (
    <>
      <Seo title={`${news.title} — Знак отличия`} description={news.excerpt} />
      <article className="bg-[#0B0B0C] text-white min-h-screen py-16 font-actay">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col lg:flex-row gap-10">
          <img
            src={news.cover}
            alt={news.title}
            className="w-full lg:w-1/2 rounded-2xl object-cover"
          />

          <div className="flex-1">
            <p className="text-neutral-400 text-sm mb-2 flex items-center gap-2">
              {news.date} • 👁 {news.views}
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
      </article>
    </>
  );
}
