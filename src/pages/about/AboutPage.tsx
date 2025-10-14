import ContactForm from '@/shared/components/ContactForm'
import Seo from "@/shared/components/Seo";
import HeroStats from '@/widgets/about/HeroStats'
import HowWeWorkSection from '@/widgets/about/HowWeWorkSection'
import MissionGallerySection from '@/widgets/about/MissionGallerySection'
import ServicesSection from '@/widgets/about/ServicesSection'
import WhyChooseUs from '@/widgets/about/WhyChooseUs'

export default function AboutPage() {
  return (
    <>
      <Seo title="О компании — Знак отличия" description="Информация о компании (каркас)" />
      <div>
        <HeroStats/>
        <WhyChooseUs/>
        <HowWeWorkSection/>
        <ServicesSection/>
        <MissionGallerySection/>
        <ContactForm/>
      </div>
    </>
  );
}
