import { useEffect } from "react"
import Seo from "@/shared/components/Seo"
import ContactForm from "@/shared/components/ContactForm"
import FaqSection from "@/widgets/home/FaqSection"
import HeroSection from "@/widgets/home/HeroSection"
import NumbersMarketSection from "@/widgets/home/NumbersMarketSection"
import ProjectsSection from "@/widgets/home/ProjectsSection"

interface HomePageProps {
  hideSeo?: boolean;
}

export default function HomePage({ hideSeo = false }: HomePageProps = {}) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    })
  }, [])

  return (
    <>
      {hideSeo ? null : (
        <Seo title="Знак отличия" description="Главная страница каркаса SPA" />
      )}
      <div>  <div
          aria-hidden
          className="
    pointer-events-none
    absolute
    left-1/2
    top-0
    -z-10
    -translate-x-1/2
    translate-y-[10%]
    md:-translate-y-1/3
    lg:-translate-y-1/2
    h-[260px] w-[320px]
    sm:h-[500px] sm:w-[800px]
    md:h-[700px] md:w-[1100px]
    lg:h-[900px] lg:w-[1600px]
    xl:h-[1100px] xl:w-[2000px]
    rounded-full
    bg-[radial-gradient(circle,_rgba(0,45,104,0.95)_0%,_rgba(0,45,104,0.65)_25%,_rgba(0,45,104,0.35)_45%,_rgba(3,7,18,0.2)_60%,_transparent_75%)]
    blur-[80px]
    sm:blur-[120px]
    md:blur-[160px]
    lg:blur-[200px]
  "
        />
        <HeroSection />
        <NumbersMarketSection />
        <ProjectsSection />
        <FaqSection />
        <ContactForm />
      </div>
    </>
  );
}
