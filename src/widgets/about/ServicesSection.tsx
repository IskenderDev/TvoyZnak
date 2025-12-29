import { Link } from 'react-router-dom'

export default function ServicesSection() {
  return (
    <section aria-labelledby="services-title">
      <div className=" mx-auto px-5 md:px-8 py-10">
        <h2
          id="services-title"
          className="text-center text-2xl md:text-3xl font-extrabold tracking-wide text-white uppercase"
        >
          НАШИ УСЛУГИ ДЛЯ АВТОНОМЕРОВ
        </h2>

        <div className="my-10 mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/services#service-eval"
            aria-label="Оценка авто номера"
            className="w-full min-h-[160px] inline-flex items-center justify-center text-center
                       text-2xl md:text-4xl font-extrabold leading-snug bg-[#f6f7f9] text-black
                       rounded-2xl px-6 transition-colors duration-200 hover:bg-[#0177FF] hover:text-white
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0177FF]
                       focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Оценка авто номера
          </Link>

          <Link
            to="/services#service-buyout"
            aria-label="Быстрый выкуп авто номера"
            className="w-full min-h-[160px] inline-flex items-center justify-center text-center
                       text-2xl md:text-4xl font-extrabold leading-snug bg-[#f6f7f9] text-black
                       rounded-2xl px-6 transition-colors duration-200 hover:bg-[#0177FF] hover:text-white
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0177FF]
                       focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Быстрый выкуп авто номера
          </Link>

          <Link
            to="/services#service-sale"
            aria-label="Продажа авто номеров «Знак Отличия»"
            className="w-full min-h-[160px] inline-flex items-center justify-center text-center
                       text-2xl md:text-4xl font-extrabold leading-snug bg-[#f6f7f9] text-black
                       rounded-2xl px-6 transition-colors duration-200 hover:bg-[#0177FF] hover:text-white
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0177FF]
                       focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Продажа авто номеров «Знак Отличия»
          </Link>

          <Link
            to="/services#service-search"
            aria-label="Поиск авто номера под ваш запрос"
            className="w-full min-h-[160px] inline-flex items-center justify-center text-center
                       text-2xl md:text-4xl font-extrabold leading-snug bg-[#f6f7f9] text-black
                       rounded-2xl px-6 transition-colors duration-200 hover:bg-[#0177FF] hover:text-white
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0177FF]
                       focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Поиск авто номера под ваш запрос
          </Link>
        </div>

        <div className="mt-5 text-center">
          <Link
            to="/contacts"
            aria-label="Узнать больше"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-[#0177FF] text-white
                       px-6 py-2 md:text-[20px]
                       transition-all duration-200 hover:brightness-95 hover:-translate-y-[1px]
                       focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Узнать больше
          </Link>
        </div>
      </div>
    </section>
  );
}
