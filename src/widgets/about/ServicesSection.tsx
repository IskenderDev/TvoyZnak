const services = [
  "Оценка вашего номера",
  "Быстрый выкуп номера",
  "Продажа номеров «Знак Отличия»",
  "Поиск номера под ваш запрос",
];

const cardBaseClasses =
  "w-full min-h-[160px] inline-flex items-center justify-center text-center text-lg md:text-xl leading-snug font-medium rounded-2xl px-6 transition-all duration-200 hover:brightness-95 hover:-translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-foreground/50 shadow-[0_8px_24px_rgba(var(--color-primary-500),0.25)]";

export default function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="bg-background text-foreground">
      <div className="mx-auto px-5 py-10 md:px-8">
        <h2
          id="services-title"
          className="font-actay-wide text-center text-2xl font-extrabold uppercase tracking-wide md:text-3xl"
        >
          НАШИ УСЛУГИ
        </h2>

        <div className="my-10 mx-auto grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((service) => (
            <button key={service} type="button" className={`${cardBaseClasses} bg-primary-500 text-primary-foreground`}>
              {service}
            </button>
          ))}
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            aria-label="Узнать больше"
            className="hidden items-center justify-center rounded-full bg-primary-500 px-6 py-2 text-primary-foreground transition-all duration-200 hover:-translate-y-[1px] hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-foreground/50 md:inline-flex md:text-[20px]"
          >
            Узнать больше
          </button>
        </div>
      </div>
    </section>
  );
}
