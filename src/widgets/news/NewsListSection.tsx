import { useEffect, useMemo, useState } from "react";
import Seo from "@/shared/components/Seo";
import Pagination from "@/shared/components/Pagination";
import NewsCard from "@/shared/components/NewsCard";
import { newsApi } from "@/shared/services/newsApi";
import type { NewsItem } from "@/entities/news/types";

const PER_PAGE = 6;

export default function NewsListSection() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    newsApi
      .list({})
      .then((data) => {
        if (!mounted) return;
        setItems(data);
      })
      .catch((err) => {
        if (!mounted) return;
        const message = err?.response?.data?.message || err?.message || "Не удалось загрузить новости";
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const pagedItems = useMemo(
    () => items.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [items, page],
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <>
      <Seo title="Новости — Знак отличия" description="Свежие новости компании и полезные материалы." />
      <section className="bg-[#0B0B0C] text-white min-h-screen py-16 font-actay">
        <div className="mx-auto px-6 max-w-6xl">
          {loading && <p className="text-center text-neutral-300">Загрузка...</p>}
          {error && <p className="text-center text-[#EB5757] mb-6">{error}</p>}

          {items.length > 0 && (
            <div className="mb-10 flex justify-center">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedItems.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}

            {!loading && items.length === 0 && !error && (
              <p className="col-span-full text-center text-neutral-300">Новости пока не опубликованы.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
