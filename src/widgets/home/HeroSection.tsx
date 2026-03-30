import { Link } from "react-router-dom";
import { LuShieldCheck, LuHeadphones, LuSparkles } from "react-icons/lu";
import { FaTelegramPlane } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden text-white"
      aria-label="Премиальные автомобильные номера"
    >
      

      <div className="relative mx-auto flex max-w-[1200px] items-center px-4 py-10 sm:px-6 lg:px-10 lg:py-0">
        <div className="grid w-full items-center gap-10 min-[770px]:gap-12 lg:gap-70">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl max-w-xl">
              Красивые
              автомобильные номера
            </h1>

            <p className="mt-4 text-sm text-neutral-300 sm:text-base lg:text-2xl font-[400]  lg:leading-relaxed">
              Оценка, покупка и продажа красивых автономеров
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0177FF] px-7 py-3.5 text-sm font-semibold text-white transition hover:shadow-blue-500/60 focus-visible:outline-none  focus-visible:ring-2 lg:text-base"
              >
                <FaTelegramPlane className="h-4 w-4 lg:h-5 lg:w-5" />
                <span>Запросить список</span>
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[780px] min-[770px]:max-w-[860px] lg:max-w-none">
            <img
              src="/home-img/heroImg.png"
              alt="Премиальный автомобиль с красивыми номерами"
              className="pointer-events-none relative mx-auto block w-full max-w-[720px] select-none min-[770px]:max-w-[820px] lg:absolute lg:inset-x-0 lg:bottom-0 lg:z-40 lg:max-w-none lg:h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
