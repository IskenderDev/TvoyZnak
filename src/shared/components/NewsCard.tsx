import { Link } from "react-router-dom";
import type { NewsItem } from "@/entities/news/types";

interface Props {
  news: NewsItem;
}

export default function NewsCard({ news }: Props) {
  const formattedDate = news.publishedAt ? formatDate(news.publishedAt) : "";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-primary-500">
      {news.cover && (
        <img src={news.cover} alt={news.title} className="w-full h-56 object-cover" loading="lazy" />
      )}
      <div className="p-5 flex flex-col justify-between min-h-[200px]">
        <div>
          {formattedDate && (
            <p className="text-neutral-400 text-sm flex items-center gap-2">{formattedDate}</p>
          )}
          <h3 className="mt-2 font-road font-bold uppercase leading-snug text-foreground">{news.title}</h3>
          {news.excerpt && <p className="text-neutral-400 text-sm mt-3 line-clamp-3">{news.excerpt}</p>}
        </div>
        <Link
          to={`/news/${news.id}`}
          className="mt-5 block rounded-xl bg-primary-500 py-2 text-center font-road font-medium text-primary-foreground transition-colors hover:bg-primary-600"
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
