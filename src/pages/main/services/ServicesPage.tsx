import ContactForm from "@/shared/components/ContactForm"
import Seo from "@/shared/components/Seo"
import ServicesSection from "@/widgets/about/ServicesSection"

const serviceBlocks = [
  {
    number: "01",
    badgeNote:
      "Если вы планируете продать красивые госномера, наша команда позволит определить справедливую цену.",
    title: "ОЦЕНКА ВАШЕГО НОМЕРА",
    description:
      "Наша команда профессионалов проведёт полную оценку вашего госномера: учтём редкость комбинации, регион, историю владения и актуальные рыночные данные, чтобы вы понимали реальную стоимость перед переговорами.",
    subtitle: "Мы предлагаем:",
    chips: [
      "Бесплатную предварительную  консультацию",
      "Экспертную оценку красивых госномеров на авто"
    ],
  },
  {
    number: "02",
    badgeNote:
      "Если вы хотите продать красивые госномера срочно, мы оценим их стоимость, согласуем цену и оформим все документы в кратчайшие сроки.",
    title: "БЫСТРЫЙ ВЫКУП НОМЕРА",
    description:
      "Наша компания предлагает услугу быстрого выкупа красивых автономеров с официальным переоформлением. Мы покупаем редкие комбинации по цене ниже рыночной и гарантируем полное юридическое сопровождение сделки.",
    subtitle: "Мы обеспечиваем:",
    chips: [
      "Мгновенную оценку и честную цену",
      "Выкуп красивых автономеров в течение одного дня",
      "Безопасное оформление и юридическую прозрачность."
    ],
  },
  {
    number: "03",
    badgeNote:
      "Если вы хотите купить красивые госномера или доверить нам их продажу, мы сделаем всё быстро, законно и выгодно.",
    title: "ПРОДАЖА НОМЕРОВ «ЗНАК ОТЛИЧИЯ»",
    description:
      "Наша компания специализируется на продаже красивых госномеров с полным юридическим сопровождением. Мы предлагаем широкий выбор уникальных комбинаций — от популярных серий с одинаковыми цифрами до эксклюзивных номеров премиум-класса.",
    subtitle: "Мы обеспечиваем:",
    chips: [
      "Большой каталог номеров с актуальными ценами",
      "Индивидуальный подбор номера под запрос клиента",
      "Безопасную и прозрачную сделку",
      "Помощь и консультацию на каждом этапе"
    ],
  },
  {
    number: "04",
    badgeNote:
      "Если вы хотите купить красивые госномера или доверить нам их продажу, мы сделаем всё быстро, законно и выгодно.",
    title: "ПОИСК НОМЕРА ПОД ВАШ ЗАПРОС",
    description:
      "Не нашли подходящий номер в нашем каталоге? Мы предлагаем услугу поиска красивого госномера под ваш запрос. Если вы хотите определённую комбинацию цифр или букв — наша команда возьмёт на себя все этапы поиска и оформления. Мы работаем напрямую с владельцами и знаем рынок изнутри. Это позволяет быстро находить даже самые редкие и эксклюзивные комбинации",
    subtitle: "Мы обеспечиваем:",
    chips: [
      "Индивидуальный подбор номера в Москве и области",
      "Полное юридическое сопровождение сделки",
      "Поиск по вашим критериям (цифры, буквы, регион)",
      "Возможность купить красивые госномера на авто безопасно и официально",
    ],
  },
];


export default function ServicesPage() {
  return (
    <>
      <Seo title="Услуги — Знак отличия" description="Все услуги компании Знак отличия по работе с автомобильными номерами" />

      <main className="  text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 py-16 sm:py-20 md:px-8 lg:py-24">
            <h1 className="mt-5 text-center text-2xl font-extrabold uppercase leading-tight sm:text-3xl lg:text-4xl">
              ВСЕ УСЛУГИ С <span className="text-[#0177FF]">АВТОМОБИЛЬНЫМИ НОМЕРАМИ</span>
              <br /> В ОДНОМ МЕСТЕ — БЫСТРО, УДОБНО И ПРОЗРАЧНО
            </h1>
            <p className="mt-5 max-w-[820px] text-center text-sm text-white/75 sm:text-base">
              Компания «ЗНАК ОТЛИЧИЯ» предлагает комплексные решения для владельцев и покупателей автомобильных номеров. Мы оцениваем, выкупаем, продаём и подбираем уникальные комбинации, обеспечивая прозрачность, безопасность и удобство на каждом этапе.
            </p>
            <div className="mt-10 mx-auto">
              <img src="/services/heroServices.png" alt="" />
            </div>
      

        
          </div>
        </section>

        <ServicesSection />

        <section className=" px-5 pb-16 pt-4 md:px-8 lg:pb-24">
          <div className="mx-auto flex flex-col max-w-6xl gap-15">
            {serviceBlocks.map((service) => (
              <article key={service.number} className="mt-10 grid grid-cols-1 items-start gap-15 lg:grid-cols-[280px_1fr] lg:gap-10">
                <div className="relative mr-10">
                  <div
                    className="rounded-2xl bg-[#0177FF] p-5 text-white shadow-[_24px_24px_rgb(44,44,44)]"
                  >
                    <div className="items-start justify-between">
                      <div className="text-2xl text-left md:text-3xl  font-bold tracking-[0.2em]">УСЛУГА</div>
                      <div className=" text-right text-5xl font-extrabold leading-none tracking-[0.2em]">{service.number}</div>
                    </div>
                    <p className="mt-5 text-xs leading-snug text-white/90">{service.badgeNote}</p>
                  </div>
                </div>

                <div className='text-white/95'>
                  <h3 className="text-2xl md:text-3xl font-extrabold uppercase">{service.title}</h3>
                  <p className="mt-2 text-[16px] md:text-2xl leading-relaxed  ">{service.description}</p>
                  <p className="mt-4 text-[16px] md:text-2xl ">{service.subtitle}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {service.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-xl border border-white/30 px-4 py-2 text-[15px] md:text-lg  transition-colors duration-200 hover:bg-white/5 max-w-100"
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

        <ContactForm />
      </main>
    </>
  )
}
