import ContactForm from "@/shared/components/ContactForm"
import Seo from "@/shared/components/Seo"
import HeroStats from "@/widgets/about/HeroStats"
import HowWeWorkSection from "@/widgets/about/HowWeWorkSection"
import ServicesSection from "@/widgets/about/ServicesSection"
import WhyChooseUs from "@/widgets/about/WhyChooseUs"
import ProjectsSection from "@/widgets/home/ProjectsSection"

export default function AboutPage() {
  return (
    <>
      <Seo title="О компании — Знак отличия" description="Информация о компании (каркас)" />
      <div>
        <HeroStats />
        <WhyChooseUs />
        <HowWeWorkSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactForm />
      </div>
    </>
  )
}
