import { Link } from "react-router-dom"

export default function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="py-10 md:py-14">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <h2
          id="services-title"
          className="text-center text-[22px] md:text-[30px] font-extrabold tracking-[0.08em] text-white uppercase"
        >
          НАШИ УСЛУГИ
        </h2>

        <div className="mt-8 md:mt-10 mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-[900px]">
          {[
            {
              to: "/services#service-eval",
              label: "Оценка автономера",
            },
            {
              to: "/services#service-buyout",
              label: "Быстрый выкуп автономера",
            },
            {
              to: "/services#service-sale",
              label: "Продажа автономеров",
            },
            {
              to: "/services#service-search",
              label: "Поиск автономера под запрос",
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className="w-full min-h-[60px] inline-flex items-center justify-center text-center
                text-[14px] md:text-[16px] font-semibold leading-snug bg-[#1C1C1C] text-white
                rounded-full px-6 shadow-[0_8px_20px_rgba(0,0,0,0.35)]
                transition-colors duration-200 hover:bg-[#282828] hover:text-white
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0177FF]
                focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/contacts"
            aria-label="Узнать больше"
            className="inline-flex items-center justify-center rounded-full bg-[#0177FF] text-white
              px-6 py-2 text-[14px] md:text-[16px]
              transition-all duration-200 hover:brightness-95 hover:-translate-y-[1px]
              focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Узнать больше
          </Link>
        </div>
      </div>
    </section>
  )
}
