import { Link } from "react-router-dom";
import { LuShieldCheck, LuHeadphones, LuSparkles } from "react-icons/lu";
import { FaTelegramPlane } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden text-white"
      aria-label="Премиальные автомобильные номера"
    >
      

      <div className="relative mx-auto flex min-h-[70svh] max-w-[1200px] items-center px-4 py-12 sm:px-6 md:px-8 lg:px-10 lg:py-16">
        <div className="grid w-full items-center gap-30  md:gap-70">
            <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Красивые
              автомобильные номера
            </h1>

            <p className="mt-4 text-sm text-neutral-300 sm:text-base md:text-lg md:leading-relaxed">
              Оценка, покупка и продажа красивых автономеров.
            </p>

            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-300 sm:text-base">
              <div className="flex items-center gap-2">
                <LuShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#0177FF]" />
                <span>500+ сделок</span>
              </div>
              <div className="flex items-center gap-2">
                <LuHeadphones className="h-4 w-4 sm:h-5 sm:w-5 text-[#0177FF]" />
                <span>24/7 поддержка</span>
              </div>
              <div className="flex items-center gap-2">
                <LuSparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#0177FF]" />
                <span>Лёгкое оформление</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contacts"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0177FF] px-7 py-3.5 text-sm font-semibold text-white transition hover:shadow-blue-500/60 focus-visible:outline-none focus-visible:ring-2 md:text-base"
              >
                <FaTelegramPlane className="h-4 w-4 md:h-5 md:w-5" />
                <span>Запросить список</span>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="/home-img/heroImg.png"
              alt="Премиальный автомобиль с красивыми номерами"
              className="pointer-events-none select-none absolute inset-x-0 bottom-0 z-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
