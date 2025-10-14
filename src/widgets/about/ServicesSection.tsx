export default function ServicesSection() {
  return (
    <section aria-labelledby="services-title">
      <div className="max-w-[900px] mx-auto px-5 md:px-8 py-10">
        <h2
          id="services-title"
          className="text-center text-2xl md:text-3xl font-extrabold tracking-wide text-white uppercase font-actay-wide"
        >
          НАШИ УСЛУГИ
        </h2>

        <div className="my-10 mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            aria-label="Оценка вашего номера"
            className="w-full min-h-[160px] inline-flex items-center justify-center text-center
                       text-lg md:text-xl leading-snug font-medium bg-[#0177FF] text-white
                       rounded-2xl px-6 transition-all duration-200
                       hover:brightness-95 hover:-translate-y-[1px]
                       focus:outline-none focus:ring-2 focus:ring-white/50
                       shadow-[0_8px_24px_rgba(1,119,255,0.25)]"
          >
            Оценка вашего номера
          </button>

          <button
            type="button"
            aria-label="Быстрый выкуп номера"
            className="w-full min-h-[160px] inline-flex items-center justify-center text-center
                       text-lg md:text-xl leading-snug font-medium bg-[#0177FF] text-white
                       rounded-2xl px-6 transition-all duration-200
                       hover:brightness-95 hover:-translate-y-[1px]
                       focus:outline-none focus:ring-2 focus:ring-white/50
                       shadow-[0_8px_24px_rgba(1,119,255,0.25)]"
          >
            Быстрый выкуп номера
          </button>

          <button
            type="button"
            aria-label="Продажа номеров «Знак Отличия»"
            className="w-full min-h-[160px] inline-flex items-center justify-center text-center
                       text-lg md:text-xl leading-snug font-medium bg-[#0177FF] text-white
                       rounded-2xl px-6 transition-all duration-200
                       hover:brightness-95 hover:-translate-y-[1px]
                       focus:outline-none focus:ring-2 focus:ring-white/50
                       shadow-[0_8px_24px_rgba(1,119,255,0.25)]"
          >
            Продажа номеров «Знак Отличия»
          </button>

          <button
            type="button"
            aria-label="Поиск номера под ваш запрос"
            className="w-full min-h-[160px] inline-flex items-center justify-center text-center
                       text-lg md:text-xl leading-snug font-medium bg-[#0177FF] text-white
                       rounded-2xl px-6 transition-all duration-200
                       hover:brightness-95 hover:-translate-y-[1px]
                       focus:outline-none focus:ring-2 focus:ring-white/50
                       shadow-[0_8px_24px_rgba(1,119,255,0.25)]"
          >
            Поиск номера под ваш запрос
          </button>
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            aria-label="Узнать больше"
            className=" hidden md:inline-flex items-center justify-center rounded-full bg-[#0177FF] text-white
                       px-6 py-2 md:text-[20px]
                       transition-all duration-200 hover:brightness-95 hover:-translate-y-[1px]
                       focus:outline-none focus:ring-2 focus:ring-white/50
"
          >
            Узнать больше
          </button>
        </div>
      </div>
    </section>
  );
}
