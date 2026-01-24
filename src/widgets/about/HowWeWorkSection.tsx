export default function HowWeWorkSection() {
  const steps = [
    {
      id: "step1",
      number: "1",
      title: "Оставляете заявку",
      description:
        "Заполняйте форму на сайте или свяжитесь с нами через мессенджеры — мы сразу уточним ваши пожелания.",
    },
    {
      id: "step2",
      number: "2",
      title: "Консультация и подбор",
      description:
        "Наши специалисты оценят ваш номер или подберут редкую комбинацию по вашим критериям: цифры, буквы, регион.",
    },
    {
      id: "step3",
      number: "3",
      title: "Сделка и оформление",
      description:
        "Все документы оформляются официально через МРЭО, с внесением данных в ПТС и СТС.",
    },
    {
      id: "step4",
      number: "4",
      title: "Готовый результат",
      description:
        "Вы получаете выбранный номер или деньги за проданный номер быстро, безопасно и без лишних хлопот.",
    },
  ] as const

  const numberBaseClass =
    "relative w-[52px] md:w-[72px] pr-2 text-right text-[44px] md:text-[64px] font-extrabold leading-none text-white/95 select-none"

  return (
    <section className="relative text-white py-12 md:py-16" aria-label="Как мы работаем">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <header className="text-center">
          {/* approx font-size: 28/36 */}
          <h2 className="text-[22px] md:text-[32px] font-extrabold tracking-[0.08em] uppercase">
            КАК МЫ РАБОТАЕМ
          </h2>
          <p className="text-[#A7C6FF] text-[12px] md:text-[14px] mt-1">
            Просто, быстро и безопасно.
          </p>
        </header>

        <div className="relative bg-[#0E4DA8] rounded-[26px] md:rounded-[30px] mt-6 md:mt-8 px-5 md:px-8 py-6 md:py-10 shadow-[0_20px_50px_rgba(1,119,255,0.35)]">
          <div className="relative flex flex-col gap-y-8 md:gap-y-10">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1
              const stepNumberClass = [
                numberBaseClass,
                isLast
                  ? "after:hidden"
                  : "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:top-full after:h-full after:my-2 md:after:h-10 after:border-l-2 after:border-dashed after:border-white/70",
              ].join(" ")

              return (
                <div key={step.id} className="flex gap-4 md:gap-6 items-start">
                  <div aria-hidden="true" className={stepNumberClass}>
                    {step.number}
                  </div>
                  <article aria-labelledby={`${step.id}-title`} className="pt-1">
                    <h3
                      id={`${step.id}-title`}
                      className="font-semibold text-[15px] md:text-[18px]"
                    >
                      {step.title}
                    </h3>
                    <p className="text-white/90 text-[12px] md:text-[14px] leading-[1.6] mt-1">
                      {step.description}
                    </p>
                  </article>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
