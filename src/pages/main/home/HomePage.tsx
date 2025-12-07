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
      <div>
        <HeroSection />
        <NumbersMarketSection />
        <ProjectsSection />
        <FaqSection />
        <ContactForm />
      </div>
    </>
  );
}
