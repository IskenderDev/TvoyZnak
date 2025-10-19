const steps = [
  {
    id: "step1-title",
    number: "1",
    title: "Оставляете заявку",
    description:
      "Заполняйте форму на сайте или свяжитесь с нами через мессенджеры — мы сразу уточним ваши пожелания.",
  },
  {
    id: "step2-title",
    number: "2",
    title: "Консультация и подбор",
    description:
      "Наши специалисты оценят ваш номер или подберут редкую комбинацию по вашим критериям: цифры, буквы, регион.",
  },
  {
    id: "step3-title",
    number: "3",
    title: "Сделка и оформление",
    description: "Все документы оформляются официально через МРЭО, с внесением данных в ПТС и СТС.",
  },
  {
    id: "step4-title",
    number: "4",
    title: "Готовый результат",
    description:
      "Вы получаете выбранный номер или деньги за проданный номер быстро, безопасно и без лишних хлопот.",
  },
];

export default function HowWeWorkSection() {
  return (
    <section className="relative bg-background text-foreground py-12 md:py-16" aria-label="Как мы работаем">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10">
        <header className="text-center">
          <h2 className="font-actay-wide text-2xl font-extrabold tracking-wide md:text-4xl">КАК МЫ РАБОТАЕМ</h2>
          <p className="mt-1 text-sm text-primary-200 md:text-base">Просто, быстро и безопасно.</p>
        </header>

        <div className="relative mt-6 rounded-[26px] bg-primary-500 px-5 py-6 text-foreground md:mt-8 md:rounded-[28px] md:px-8 md:py-10">
          <div className="relative flex flex-col gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <div key={step.id} className="flex items-center gap-4 md:gap-6">
                  <div
                    aria-hidden="true"
                  className={`relative w-[60px] pr-2 text-right text-6xl font-extrabold leading-none text-foreground/95 select-none font-actay-druk md:w-[90px] md:pr-3 md:text-9xl ${
                    isLast
                      ? ""
                      : "after:absolute after:left-1/2 after:top-full after:my-2 after:h-full after:-translate-x-1/2 after:border-l-4 after:border-dashed after:border-foreground md:after:h-12"
                  }`}
                >
                  {step.number}
                </div>
                <article aria-labelledby={step.id}>
                  <h3 id={step.id} className="text-base font-semibold md:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/90 md:text-[15px]">{step.description}</p>
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
