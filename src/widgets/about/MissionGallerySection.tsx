
export type MissionItem = { id: string; src: string; alt?: string };

type Props = {
  items?: MissionItem[];
};

const FALLBACK: MissionItem[] = [
  { id: "c1", src: "/bmw.png", alt: "BMW — фото из галереи" },
  { id: "c2", src: "/bmw.png", alt: "Hongqi — фото из галереи" },
  { id: "c3", src: "/bmw.png", alt: "Mercedes — фото из галереи" },
  { id: "c4", src: "/bmw.png", alt: "Porsche — фото из галереи" },
  { id: "c4", src: "/bmw.png", alt: "Porsche — фото из галереи" },
  { id: "c4", src: "/bmw.png", alt: "Porsche — фото из галереи" },
];

export default function MissionGallerySection({ items }: Props) {
  const data = items && items.length > 0 ? items : FALLBACK;

  return (
    <section className="relative text-white py-10 md:py-14" aria-label="Наша миссия — делать редкие номера доступными и безопасными">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-wide text-center uppercase">
          НАША МИССИЯ — ДЕЛАТЬ РЕДКИЕ НОМЕРА
          <span className="text-[#0177FF] block">ДОСТУПНЫМИ И БЕЗОПАСНЫМИ</span>
        </h2>

        <p className="max-w-[900px] mx-auto text-neutral-300 text-sm md:text-base leading-relaxed mt-3 md:mt-4 text-center">
          Мы помогаем людям находить уникальные и красивые автомобильные номера,
          упрощаем процесс их покупки и продажи и обеспечиваем полное юридическое
          сопровождение на каждом этапе. Наша цель — создавать удобный, прозрачный и
          безопасный сервис, где каждый клиент получает честную оценку и индивидуальный
          подход.
        </p>

        <div className="mt-8 md:mt-10">
          <style>{`.rail::-webkit-scrollbar{display:none}`}</style>
          <div
            className="rail flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 [-ms-overflow-style:none] [scrollbar-width:none]"
            aria-label="Галерея наших работ"
          >
            {data.map((img) => (
              <article
                key={img.id}
                className="min-w-[78%] sm:min-w-[48%] md:min-w-[31%] lg:min-w-[28%] snap-start"
              >
                <div className="rounded-2xl overflow-hidden bg-neutral-900">
                  <div className="aspect-[3/4]">
                    <img
                      src={img.src}
                      alt={img.alt ?? "Фото из галереи"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
