import { Link } from "react-router-dom";
import type { NewsItem } from "@/entities/news/types";

interface Props {
  news: NewsItem;
}

export default function NewsCard({ news }: Props) {
  const formattedDate = news.publishedAt ? formatDate(news.publishedAt) : "";

  return (
    <div className=" border border-[#1E1E1E] hover:border-[#0177FF] rounded-2xl overflow-hidden transition-all">
      {news.cover && (
        <img src={news.cover} alt={news.title} className="w-full h-56 object-cover" loading="lazy" />
      )}
      <div className="p-5 flex flex-col justify-between min-h-[200px]">
        <div>
          {formattedDate && (
            <p className="text-neutral-400 text-sm flex items-center gap-2">
              <time dateTime={news.publishedAt!}>{formattedDate}</time>
            </p>
          )}

          <h3 className="text-white font-sans font-bold mt-2 leading-snug uppercase">
            {news.title}
          </h3>

          {news.excerpt && (
            <p className="text-neutral-400 text-sm mt-3 line-clamp-3">{news.excerpt}</p>
          )}
        </div>

        <Link
          to={`/news/${news.id}`}
          className="block mt-5 text-center text-white bg-[#0177FF] hover:bg-[#046FFF] rounded-4xl py-2 font-sans font-medium"
        >
          Читать больше
        </Link>
      </div>
    </div>
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
