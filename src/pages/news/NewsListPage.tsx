import { useState } from "react";
import NewsCard from "@/components/NewsCard";
import Pagination from "@/components/Pagination";
import { NEWS } from "@/data/news";
import Seo from "@/shared/components/Seo";

const PER_PAGE = 6;

export default function NewsListPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(NEWS.length / PER_PAGE);
  const paged = NEWS.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <Seo title="Новости — Знак отличия" description="Свежие новости компании и полезные материалы" />
      <section className="bg-[#0B0B0C] text-white min-h-screen py-16 font-actay">
        <div className="max-w-[1200px] mx-auto px-6">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
