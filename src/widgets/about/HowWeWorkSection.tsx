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
  ] as const;

  const numberBaseClass =
    "relative w-[60px] md:w-[90px] pr-2 md:pr-3 text-right text-6xl md:text-9xl font-extrabold leading-none text-white/95 select-none";

  return (
    <section className="relative text-white py-12 md:py-16" aria-label="Как мы работаем">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <header className="text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-wide">
            КАК МЫ РАБОТАЕМ
          </h2>
          <p className="text-[#A7C6FF] text-sm md:text-base mt-1">Просто, быстро и безопасно.</p>
        </header>

        <div className="relative bg-gradient-to-r from-[#001833] via-[#003979] to-[#004899] rounded-[26px] md:rounded-[28px] mt-6 md:mt-8 px-5 md:px-8 py-6 md:py-10">
          <div className="relative flex flex-col gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              const stepNumberClass = [
                numberBaseClass,
                isLast
                  ? "after:hidden"
                  : "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:top-full after:h-full after:my-2 md:after:h-12 after:border-l-4 after:border-dashed after:border-white",
              ].join(" ");

              return (
                <div key={step.id} className="flex gap-4 md:gap-6 items-center">
                  <div aria-hidden="true" className={stepNumberClass}>
                    {step.number}
                  </div>
                  <article aria-labelledby={`${step.id}-title`}>
                    <h3 id={`${step.id}-title`} className="font-semibold text-base md:text-lg">
                      {step.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-[15px] leading-relaxed mt-1">
                      {step.description}
                    </p>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}