import { Link } from "react-router-dom";
import type { Post } from "@/entities/post/types";

interface Props {
  news: Post;
}

export default function NewsCard({ news }: Props) {
  const formattedDate = news.publishedAt ? formatDate(news.publishedAt) : "";
  const targetId = news.slug || news.id;

  return (
    <div className="bg-[#0B0B0C] border border-[#1E1E1E] hover:border-[#0177FF] rounded-2xl overflow-hidden transition-all">
      {news.cover && (
        <img src={news.cover} alt={news.title} className="w-full h-56 object-cover" loading="lazy" />
      )}
      <div className="p-5 flex flex-col justify-between min-h-[200px]">
        <div>
          {formattedDate && (
            <p className="text-neutral-400 text-sm flex items-center gap-2">{formattedDate}</p>
          )}
          <h3 className="text-white font-road font-bold mt-2 leading-snug uppercase">{news.title}</h3>
          {news.excerpt && <p className="text-neutral-400 text-sm mt-3 line-clamp-3">{news.excerpt}</p>}
        </div>
        <Link
          to={`/news/${targetId}`}
          className="block mt-5 text-center text-white bg-[#0177FF] hover:bg-[#046FFF] rounded-xl py-2 font-road font-medium"
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
