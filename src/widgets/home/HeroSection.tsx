import { Link } from 'react-router-dom'

export default function HeroSection() {
  const tags = ["Юридическая гарантия", "Быстрый выкуп", "Уникальные комбинации"];

  return (
    <section
      className="relative isolate  bg-[#0B0B0C] text-white w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
      aria-label="Премиальные автомобильные номера с гарантией"
    >
      <div className="relative w-full px-6 lg:px-16 py-10 md:py-16 min-h-[70svh] md:min-h-[80svh] lg:min-h-[90svh] flex items-center ">
        <div className="relative z-10 -top-20 w-full md:pr-[45vw] lg:pr-[40vw] xl:pr-[38vw]">
          <h1 className="font-bold uppercase leading-tight text-3xl sm:text-4xl md:text-5xl">
            Премиальные автомобильные <br /> номера с гарантией
          </h1>

          <p className="mt-4 mb-6 text-neutral-300 text-base md:text-lg leading-relaxed">
            Надёжная покупка, оценка и продажа красивых номеров. <br />
            Прозрачные сделки, профессиональная поддержка и <br />
            персональный подбор для каждого клиента.
          </p>

          <div className="flex flex-wrap">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-block mr-2 mb-2 rounded-full border border-[#0177FF] px-4 py-1 text-sm text-neutral-200"
              >
                {t}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="mt-6 rounded-full bg-[#0177FF] px-6 py-3 font-medium text-white transition-colors duration-300 hover:brightness-110"
          >
            <Link to="/contacts">Запросить список</Link>
          </button>
        </div>

        <img
          src="/home-img/heroImg.png"
          alt=""
          aria-hidden="true"
          className="
            pointer-events-none select-none
            absolute right-0 bottom-0 z-0
            h-auto object-contain
           sm:w-[70vw] md:w-[45vw] lg:w-[60vw]
          "
        />
      </div>
    </section>
  );
}
