import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "@/shared/components/Seo";
import NewsCard from "@/shared/components/NewsCard";
import { newsApi } from "@/shared/services/newsApi";
import type { NewsItem } from "@/entities/news/types";

const PER_PAGE = 6;

export default function NewsDetailsSection() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([newsApi.get(id), newsApi.list({})])
      .then(([current, list]) => {
        if (!mounted) return;
        setItem(current);
        const filtered = list.filter((news) => news.id !== current.id).slice(0, PER_PAGE);
        setRelated(filtered);
      })
      .catch((err) => {
        if (!mounted) return;
        const message = err?.response?.data?.message || err?.message || "Не удалось загрузить новость";
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const publishedDate = useMemo(() => (item?.publishedAt ? formatDate(item.publishedAt) : ""), [item]);

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
        <p className="text-neutral-300">Новость не найдена</p>
      </section>
    );
  }

  return (
    <>
      <Seo title={`${item.title} — Знак отличия`} description={item.excerpt || item.content?.slice(0, 180)} />
      <Link to="/news" className="text-primary-500 hover:underline mx-6">
        ← Все новости
      </Link>
      <article className="bg-background text-foreground min-h-screen py-8 font-actay">
        <div className="mx-auto px-6 max-w-6xl flex flex-col lg:flex-row gap-10">
          {item.cover && (
            <img src={item.cover} alt={item.title} className="w-full lg:w-1/2 rounded-2xl object-cover" loading="lazy" />
          )}

          <div className="flex-1">
            {publishedDate && <p className="text-neutral-400 text-sm mb-2 flex items-center gap-2">{publishedDate}</p>}
            <h1 className="text-3xl md:text-4xl font-road font-bold mb-4 uppercase leading-snug">{item.title}</h1>
            {item.excerpt && <p className="text-neutral-300 leading-relaxed mb-6 font-road">{item.excerpt}</p>}
            {item.content && (
              <div className="text-neutral-300 whitespace-pre-line leading-relaxed font-road">{item.content}</div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="m-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </article>
    </>
  );
}

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(+date)) return "";
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
