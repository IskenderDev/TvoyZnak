import ContactForm from "@/shared/components/ContactForm"
import Seo from "@/shared/components/Seo"
import ServicesSection from "@/widgets/about/ServicesSection"

const serviceHighlights = [
  {
    id: "01",
    title: "Оценка выкупа номера",
    subtitle: "Получите точную стоимость номера за 15 минут",
    description:
      "Наши эксперты анализируют рыночную стоимость и актуальные сделки, чтобы предложить честную цену за ваш автомобильный номер.",
    bullets: [
      "Анализ базы премиальных номеров по всей России",
      "Юридическая проверка права собственности и истории",
      "Конфиденциальность и прозрачные условия",
    ],
    cta: "Оценить номер",
  },
  {
    id: "02",
    title: "Быстрый выкуп номера",
    subtitle: "Заключим сделку в день обращения",
    description:
      "Выкупим номер в кратчайшие сроки с полным юридическим сопровождением и гарантией безопасного расчёта.",
    bullets: [
      "Юридическое сопровождение на всех этапах",
      "Предварительная оценка удалённо",
      "Сделка в удобном для вас формате",
    ],
    cta: "Продать номер",
  },
  {
    id: "03",
    title: "Продажа номеров «Знак Отличия»",
    subtitle: "Подберём номер под ваш статус и задачи",
    description:
      "Эксклюзивные подборки автомобильных номеров с гарантией юридической чистоты и быстрым оформлением сделки.",
    bullets: [
      "Каталог проверенных премиальных номеров",
      "Гибкие условия оплаты и бронирования",
      "Персональный менеджер от подбора до сделки",
    ],
    cta: "Подобрать номер",
  },
  {
    id: "04",
    title: "Поиск номера под запрос",
    subtitle: "Найдём номер вашей мечты в сжатые сроки",
    description:
      "Расскажите, какой номер вам нужен, и мы подберём варианты, соответствующие вашему бюджету и пожеланиям.",
    bullets: [
      "Работаем с закрытыми базами и сообществами",
      "Предлагаем только подтверждённые варианты",
      "Помогаем оформить сделку и поставить номер на учёт",
    ],
    cta: "Оставить запрос",
  },
]

const advantages = [
  {
    title: "Юридическая безопасность",
    text: "Работаем только по официальным договорам и сопровождаем сделки юристами с опытом в автомобильной сфере.",
  },
  {
    title: "Эксклюзивная база",
    text: "Собственная база премиальных номеров, к которой имеют доступ лишь постоянные клиенты и партнёры компании.",
  },
  {
    title: "Персональный подход",
    text: "Назначаем персонального менеджера, который ведёт клиента от первого обращения до окончательной передачи номеров.",
  },
]

export default function ServicesPage() {
  return (
    <>
      <Seo title="Услуги — Знак отличия" description="Все услуги компании Знак отличия по работе с автомобильными номерами" />

      <main className="bg-[#050505] text-white">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#050505] to-[#0B0B0C]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 h-72 w-72 sm:w-96 sm:h-96 -translate-x-1/2 rounded-full bg-[#0177FF]/20 blur-[110px]" />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-5 py-16 md:px-8 md:py-20 lg:flex-row lg:items-center">
            <div className="flex-1 text-center lg:text-left">
              <p className="font-medium uppercase tracking-[0.3em] text-[#8AAFFF]">Все услуги в одном месте</p>
              <h1 className="mt-4 font-actay-wide text-3xl leading-tight md:text-4xl lg:text-5xl">
                Все услуги с автомобильными номерами: быстро, удобно и безопасно
              </h1>
              <p className="mt-5 text-base text-[#D1D5DB] md:text-lg">
                Поможем оценить, купить или продать эксклюзивный номер. Работаем по всей России, обеспечиваем конфиденциальность и
                юридическое сопровождение на каждом этапе сделки.
              </p>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  type="button"
                  className="w-full rounded-full bg-[#0177FF] px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
                >
                  Получить консультацию
                </button>
                <button
                  type="button"
                  className="w-full rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:text-[#8AAFFF] sm:w-auto"
                >
                  Смотреть каталог номеров
                </button>
              </div>
            </div>

            <div className="flex-1">
              <div className="mx-auto w-full max-w-[500px] rounded-[32px] border border-white/10 bg-[#0F1013] p-6 shadow-[0_25px_60px_rgba(1,119,255,0.15)]">
                <div className="aspect-[16/9] w-full rounded-2xl border border-dashed border-white/20 bg-[#121318] flex items-center justify-center">
                  <span className="text-xs uppercase tracking-[0.35em] text-white/40 sm:text-sm">Изображение для страницы</span>
                </div>
                <p className="mt-6 text-center text-sm text-[#9CA3AF] sm:text-base">
                  Здесь можно разместить визуал с автомобилями или вашей командой, чтобы подчеркнуть экспертность и премиальный подход.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-[#090A0C]">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-3 md:px-8 md:py-16">
            {advantages.map((item) => (
              <div key={item.title} className="rounded-3xl bg-[#0F1013] p-6 shadow-[0_20px_45px_rgba(1,119,255,0.12)]">
                <h3 className="text-xl font-semibold text-white md:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#D1D5DB] md:text-base">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#050505]">
          <ServicesSection />
        </section>

        <section className="bg-[#050505]">
          <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-20">
            <div className="space-y-10">
              {serviceHighlights.map((service) => (
                <article
                  key={service.id}
                  className="grid grid-cols-1 gap-6 rounded-[40px] border border-white/5 bg-gradient-to-br from-[#0F1013] to-[#05070B] p-8 shadow-[0_30px_80px_rgba(1,119,255,0.15)] md:grid-cols-[auto_1fr] md:gap-10 md:p-12"
                >
                  <div className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0177FF] text-2xl font-bold text-white md:h-20 md:w-20">
                      {service.id}
                    </span>
                    <div className="text-left md:text-center">
                      <h3 className="font-actay-wide text-2xl text-white md:text-3xl">{service.title}</h3>
                      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#8AAFFF] md:text-base">{service.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-6 md:gap-8">
                    <div>
                      <p className="text-sm leading-relaxed text-[#D1D5DB] md:text-base">{service.description}</p>

                      <ul className="mt-5 space-y-3 text-sm text-[#F9FAFB]/90 md:text-base">
                        {service.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span className="mt-[7px] inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#0177FF]" />
                            <span className="flex-1 leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <button
                        type="button"
                        className="w-full rounded-full bg-[#0177FF] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 md:w-auto md:px-8"
                      >
                        {service.cta}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-[#090A0C]">
          <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-5">
                <h2 className="font-actay-wide text-3xl md:text-4xl">Как мы работаем</h2>
                <p className="text-sm text-[#D1D5DB] md:text-base">
                  Мы берём на себя полный цикл сделки: от первичного запроса до регистрации номера. Для каждого клиента готовим индивидуальный план и
                  подбираем лучшие условия.
                </p>
                <ol className="space-y-4 text-sm text-[#F3F4F6]/90 md:text-base">
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#0177FF] text-sm font-semibold">1</span>
                    <span className="leading-relaxed">Проводим консультацию и уточняем пожелания к номеру или условиям сделки.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#0177FF] text-sm font-semibold">2</span>
                    <span className="leading-relaxed">Подбираем предложения, проводим юридическую проверку и подтверждаем наличие.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#0177FF] text-sm font-semibold">3</span>
                    <span className="leading-relaxed">Организуем сделку, сопровождаем оформление и передачу номера.</span>
                  </li>
                </ol>
              </div>

              <div className="rounded-[36px] border border-dashed border-white/15 bg-[#0F1013] p-8 text-center">
                <div className="mx-auto flex h-full flex-col justify-center gap-6">
                  <div className="aspect-[4/3] w-full rounded-2xl border border-white/10 bg-[#121318]" />
                  <p className="text-sm text-[#9CA3AF] md:text-base">
                    Разместите здесь фото команды, процесс сделки или инфографику, которая подчеркнёт ваш подход к работе.
                  </p>
                  <button
                    type="button"
                    className="mx-auto inline-flex rounded-full border border-white/20 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:border-white/40 hover:text-[#8AAFFF]"
                  >
                    Узнать подробнее
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#050505]">
          <ContactForm />
        </section>
      </main>
    </>
  )
}
