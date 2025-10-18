import ContactForm from "@/shared/components/ContactForm"
import Seo from "@/shared/components/Seo"
import ServicesSection from "@/widgets/about/ServicesSection"

const heroActions = [
  "Оценка вашего номера",
  "Быстрый выкуп номера",
  "Продажа номеров «Знак Отличия»",
  "Поиск номера под ваш запрос",
]

const serviceBlocks = [
  {
    number: "01",
    badgeNote:
      "Экспертно оцениваем комбинацию, анализируем закрытые сделки и актуальный спрос.",
    title: "ОЦЕНКА ВАШЕГО НОМЕРА",
    description:
      "Подготовим подробный отчёт о стоимости номера, учтём редкость комбинации, регион и историю владения, чтобы вы понимали реальную цену перед сделкой.",
    subtitle: "Мы предлагаем",
    chips: [
      "Аналитику по базе премиальных номеров",
      "Оценку за 15 минут",
      "Персональные рекомендации по продаже",
      "Юридическую проверку комбинации",
    ],
  },
  {
    number: "02",
    badgeNote:
      "Сделка в день обращения с прозрачными условиями и гарантиями безопасности.",
    title: "БЫСТРЫЙ ВЫКУП НОМЕРА",
    description:
      "Организуем оперативный выкуп вашего госномера: согласуем цену, подготовим документы и возьмём на себя расчёты в удобном для вас формате.",
    subtitle: "Мы обеспечиваем",
    chips: [
      "Фиксированную цену до встречи",
      "Расчёт наличными или безналично",
      "Оформление договора",
      "Сопровождение передачи номера",
    ],
  },
  {
    number: "03",
    badgeNote:
      "Эксклюзивные комбинации «Знак Отличия» с гарантией юридической чистоты и бронирования.",
    title: "ПРОДАЖА НОМЕРОВ «ЗНАК ОТЛИЧИЯ»",
    description:
      "Предложим лучшие комбинации из закрытой базы, оформим бронь и проведём сделку под ключ, чтобы вы получили премиальный номер без лишних хлопот.",
    subtitle: "Мы предлагаем",
    chips: [
      "Каталог редких комбинаций",
      "Персонального менеджера",
      "Гибкие условия оплаты",
      "Подготовку пакета документов",
    ],
  },
  {
    number: "04",
    badgeNote:
      "Находим номера под ваш запрос и сопровождаем поиск до результата, соблюдая конфиденциальность.",
    title: "ПОИСК НОМЕРА ПОД ВАШ ЗАПРОС",
    description:
      "Расскажите, какой госномер нужен, и мы предложим подходящие варианты: проверим по закрытым каналам, согласуем условия и доведём сделку до регистрации.",
    subtitle: "Мы предлагаем",
    chips: [
      "Поиск по партнёрским базам",
      "Подтверждение юридической чистоты",
      "Согласование условий сделки",
      "Контроль постановки на учёт",
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
      <Seo title="Услуги — Знак отличия" description="Все услуги компании Знак отличия по работе с автомобильными номерами" />

      <main className="bg-[#040507] text-white">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#040507] via-[#05070A] to-[#06070B]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#0177FF]/25 blur-[140px]" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#040507] to-transparent" />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 py-16 sm:py-20 md:px-8 lg:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8AAFFF] sm:text-sm">Наши решения</p>
            <h1 className="mt-5 text-center font-actay-wide text-2xl font-extrabold uppercase leading-tight sm:text-3xl lg:text-4xl">
              ВСЕ УСЛУГИ С <span className="text-[#0177FF]">АВТОМОБИЛЬНЫМИ НОМЕРАМИ</span>
              <br /> В ОДНОМ МЕСТЕ — БЫСТРО, УДОБНО И ПРОЗРАЧНО
            </h1>
            <p className="mt-5 max-w-[820px] text-center text-sm text-white/75 sm:text-base">
              Оценка, выкуп и продажа премиальных автомобильных номеров по всей России. Мы сопровождаем сделку, обеспечиваем
              конфиденциальность и подбираем решения под ваши задачи.
            </p>

            <div className="relative mt-6 flex w-full max-w-3xl flex-col items-center gap-4 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center">
              {heroActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  className="w-full rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/5 sm:w-auto sm:text-sm"
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="relative mt-6 flex w-full max-w-4xl items-end justify-center gap-3 sm:mt-8">
              <div className="relative flex w-32 flex-col items-center justify-end rounded-3xl border border-dashed border-white/15 bg-white/5 py-4 backdrop-blur-sm sm:w-40">
                <div className="flex h-full w-full max-h-[260px] items-center justify-center rounded-2xl border border-white/15 bg-[#0B1018]/70 px-6 py-8 text-center text-[10px] uppercase tracking-[0.2em] text-white/40 sm:max-h-[320px]">
                  ЛЕВОЕ АВТО
                </div>
              </div>
              <div className="relative z-20 flex w-40 scale-90 flex-col items-center justify-end rounded-3xl border border-dashed border-[#0177FF]/30 bg-[#0E1420] px-6 py-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/40 shadow-[0_25px_60px_rgba(1,119,255,0.2)] sm:w-56 sm:scale-100">
                <div className="flex h-full w-full max-h-[260px] items-center justify-center rounded-2xl border border-[#0177FF]/30 bg-[#101726] px-6 py-10 sm:max-h-[320px]">
                  ГЛАВНОЕ АВТО
                </div>
              </div>
              <div className="relative z-10 flex w-32 scale-90 flex-col items-center justify-end rounded-3xl border border-dashed border-white/15 bg-white/5 py-4 opacity-95 backdrop-blur-sm sm:w-40 sm:scale-100">
                <div className="flex h-full w-full max-h-[260px] items-center justify-center rounded-2xl border border-white/15 bg-[#0B1018]/70 px-6 py-8 text-center text-[10px] uppercase tracking-[0.2em] text-white/40 sm:max-h-[320px]">
                  ПРАВОЕ АВТО
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#040507]">
          <div className="mx-auto max-w-5xl px-5 pb-12 pt-6 sm:pb-16 md:px-8">
            <ServicesSection />
          </div>
        </section>

        <section className="bg-[#040507] px-5 pb-16 pt-4 md:px-8 lg:pb-24">
          <div className="mx-auto max-w-5xl">
            {serviceBlocks.map((service) => (
              <article key={service.number} className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
                <div className="relative">
                  <div className="relative rounded-2xl bg-[#1E63FF] p-5 text-white shadow-[0_6px_0_0_rgba(255,255,255,0.08)_inset] before:absolute before:-bottom-3 before:left-3 before:right-3 before:h-3 before:rounded-full before:bg-black/25 before:content-['']">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold tracking-[0.35em] text-white/80">УСЛУГА</span>
                      <span className="font-actay-wide text-4xl font-extrabold leading-none sm:text-5xl">{service.number}</span>
                    </div>
                    <p className="mt-5 text-xs leading-snug text-white/90">{service.badgeNote}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-actay-wide text-lg font-extrabold uppercase sm:text-xl">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{service.description}</p>
                  <p className="mt-4 text-sm text-white/70">{service.subtitle}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {service.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-xl border border-white/30 px-4 py-2 text-xs text-white/80 transition-colors duration-200 hover:bg-white/5 sm:text-sm"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#040507] px-5 pb-20 pt-12 md:px-8 lg:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-actay-wide text-xl font-extrabold uppercase sm:text-2xl">ОСТАВЬТЕ ЗАЯВКУ!</h2>
            <p className="mt-3 text-sm text-white/70 sm:text-base">Расскажите о задаче, и мы свяжемся с вами, чтобы предложить лучший вариант.</p>
          </div>
          <div className="mx-auto mt-8 max-w-[900px]">
            <ContactForm />
          </div>
        </section>
      </main>
    </>
  )
}
