import { Link } from "react-router-dom";
import type { NewsItem } from "@/data/news";

export default function NewsCard({ news }: { news: NewsItem }) {
  return (
    <div className="bg-[#0B0B0C] border border-[#1E1E1E] hover:border-[#0177FF] rounded-2xl overflow-hidden transition-all">
      <img src={news.cover} alt={news.title} className="w-full h-56 object-cover" />
      <div className="p-5 flex flex-col justify-between min-h-[200px]">
        <div>
          <p className="text-neutral-400 text-sm flex items-center gap-2">
            {news.date} • 👁 {news.views}
          </p>
          <h3 className="text-white font-road font-bold mt-2 leading-snug uppercase">
            {news.title}
          </h3>
        </div>
        <Link
          to={`/news/${news.slug}`}
          className="block mt-5 text-center text-white bg-[#0177FF] hover:bg-[#046FFF] rounded-xl py-2 font-road font-medium"
        >
          Читать больше
        </Link>
      </div>
    </div>
  );
}
