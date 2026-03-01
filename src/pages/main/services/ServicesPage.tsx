import { useEffect } from "react"
import ContactForm from "@/shared/components/ContactForm"
import Seo from "@/shared/components/Seo"
import ServicesSection from "@/widgets/about/ServicesSection"
import { useLocation } from "react-router-dom"

const serviceBlocks = [
  {
    id: "service-eval",
    number: "01",
    badgeNote:
      "Если вы планируете продать красивые госномера, наша команда позволит определить справедливую цену.",
    title: "ОЦЕНКА АВТОНОМЕРА",
    description:
      "Наша команда профессионалов проведёт полную оценку вашего госномера: учтём редкость комбинации, регион, историю владения и актуальные рыночные данные, чтобы вы понимали реальную стоимость.",
    subtitle: "Мы предлагаем:",
    chips: [
      "Бесплатную предварительную  консультацию",
      "Экспертную оценку красивых госномеров на авто",
    ],
  },
  {
    id: "service-buyout",
    number: "02",
    badgeNote:
      "Если вы хотите продать красивые госномера срочно, мы оценим их стоимость, согласуем цену и оформим все документы в кратчайшие сроки.",
    title: "БЫСТРЫЙ ВЫКУП АВТОНОМЕРА",
    description:
      "Наша компания предлагает услугу быстрого выкупа красивых автономеров с официальным переоформлением. Мы покупаем редкие комбинации по цене ниже рыночной и гарантируем полное юридическое сопровождение сделки.",
    subtitle: "Мы обеспечиваем:",
    chips: [
      "Мгновенную оценку и честную цену",
      "Выкуп красивых автономеров в течение одного дня",
      "Безопасное оформление и юридическую прозрачность",
    ],
  },
  {
    id: "service-sale",
    number: "03",
    badgeNote:
      "Если вы хотите купить красивые госномера или доверить нам их продажу, мы сделаем всё быстро, законно и выгодно.",
    title: "ПРОДАЖА АВТОНОМЕРОВ",
    description:
      "Наша компания специализируется на продаже красивых госномеров с полным юридическим сопровождением. Мы предлагаем широкий выбор уникальных комбинаций — от популярных серий с одинаковыми цифрами до эксклюзивных номеров премиум-класса.",
    subtitle: "Мы обеспечиваем:",
    chips: [
      "Большой каталог номеров с актуальными ценами",
      "Индивидуальный подбор номера под ваш запрос",
      "Безопасную и прозрачную сделку",
      "Помощь и консультацию на каждом этапе",
    ],
  },
  {
    id: "service-search",
    number: "04",
    badgeNote:
      "Если вы хотите купить красивые госномера или доверить нам их продажу, мы сделаем всё быстро, законно и выгодно.",
    title: "ПОИСК АВТОНОМЕРА ПОД ЗАПРОС",
    description:
      "Не нашли подходящий номер в нашем каталоге? Мы предлагаем услугу поиска красивого госномера под ваш запрос. Если вы хотите определённую комбинацию цифр или букв — наша команда возьмёт на себя все этапы поиска и оформления. Мы работаем напрямую с владельцами и знаем рынок изнутри. Это позволяет быстро находить даже самые редкие и эксклюзивные комбинации.",
    subtitle: "Мы обеспечиваем:",
    chips: [
      "Индивидуальный подбор номера в Москве и в Московской области",
      "Полное юридическое сопровождение сделки",
      "Поиск по вашим критериям (цифры, буквы, регион)",
      "Возможность купить красивые госномера на авто безопасно и официально",
    ],
  },
]

function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    const id = hash.replace("#", "")
    const el = document.getElementById(id)

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [hash])
}

export default function ServicesPage() {
  useScrollToHash()

  return (
    <>
      <Seo
        title="Услуги — Знак отличия"
        description="Все услуги компании Знак отличия по работе с автомобильными номерами"
      />
      <main className="text-white">
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" />

            <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pt-12 pb-16 sm:pt-12 sm:pb-20 md:px-8 lg:pb-24">
              <h1 className="text-center text-2xl font-bold uppercase leading-tight sm:text-3xl lg:text-4xl">
                ВСЕ УСЛУГИ С{" "}
                <span className="text-[#0177FF]">АВТОМОБИЛЬНЫМИ НОМЕРАМИ</span>
                <br /> В ОДНОМ МЕСТЕ — БЫСТРО, УДОБНО И ПРОЗРАЧНО
              </h1>
              <p className="mt-5 max-w-[820px] text-center text-sm text-[#bebebe] sm:text-lg">
                Компания «ЗНАК ОТЛИЧИЯ» предлагает комплексные решения для
                владельцев и покупателей автомобильных номеров. Мы оцениваем,
                выкупаем, продаём и подбираем уникальные комбинации, обеспечивая
                прозрачность, безопасность и удобство на каждом этапе.
              </p>
              <div className="mt-10 -mb-15 mx-auto md:h-auto">
                <img src="/services/heroServices.png" alt="" />
              </div>
            </div>
          </section>

          <ServicesSection />

          <section className="px-5 pb-16 pt-4 md:px-8 lg:pb-24">
            <div className="mx-auto flex flex-col max-w-6xl gap-15">
              {serviceBlocks.map((service) => (
                <article
                  key={service.number}
                  id={service.id}
                  className="mt-10 grid grid-cols-1 items-start gap-15 md:grid-cols-[280px_1fr] lg:gap-10"
                >
                  <div className="relative mr-10">
                    <div className="rounded-2xl bg-[#0177FF] p-5 text-white ">
                      <div className="items-start justify-between">
                        <div className="text-2xl text-left md:text-3xl font-bold tracking-[0.2em]">
                          
                        </div>
                        <div className="text-right text-5xl font-bold leading-none tracking-[0.2em]">
                          {service.number}
                        </div>
                      </div>
                      <p className="mt-5 text-xs leading-snug text-white/90">
                        {service.badgeNote}
                      </p>
                    </div>
                  </div>

                  <div className="text-white/95">
                    <h3 className="text-2xl md:text-3xl font-bold uppercase">
                      {service.title}
                    </h3>
                    <p className="my-5 text-[16px] md:text-lg leading-relaxed">
                      {service.description}
                    </p>
                    <p className="mt-4 text-[16px] md:text-lg">
                      {service.subtitle}
                    </p>
                    <div className="mt-3 flex flex-col">
                      {service.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-xl py-2 text-[12px] md:text-[14px] duration-200 text-[#bebebe]"
                        >
                          —  {chip}
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
