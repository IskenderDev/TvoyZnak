import { Link } from 'react-router-dom'

export default function HeroSection() {


  return (
    <section
      className="relative isolate bg-[#0B0B0C] text-white w-full overflow-hidden"
      aria-label="Премиальные автомобильные номера "
    >
      <div className="relative w-full px-6 lg:px-16 py-10 md:py-16 min-h-[70svh] md:min-h-[80svh] lg:min-h-[90svh] flex items-center">
        <div className="relative z-10 w-full md:pr-[45vw] lg:pr-[40vw] xl:pr-[38vw]">
          <h1 className="font-bold uppercase leading-tight text-3xl sm:text-4xl md:text-5xl">
            Премиальные автомобильные <br /> номера 
          </h1>

          <p className="mt-4 mb-6 text-neutral-300 text-base md:text-lg leading-relaxed">
            Надёжная покупка, оценка и продажа красивых номеров. <br />
            Прозрачные сделки, профессиональная поддержка и 
            персональный подбор для каждого клиента.
          </p>

         

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
