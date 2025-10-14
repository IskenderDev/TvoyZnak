import Seo from "@/shared/components/Seo"
import ContactForm from '@/shared/components/ContactForm'
import FaqSection from '@/widgets/home/FaqSection'
import HeroSection from '@/widgets/home/HeroSection'
import ProjectsSection from '@/widgets/home/ProjectsSection'
import NumbersMarketPage from '../../widgets/home/NumbersMarketPage'
import PlateStaticSm from '@/shared/components/plate/PlateStaticSm'

export default function HomePage() {
  return (
    <>
      <Seo title="Знак отличия" description="Главная страница каркаса SPA" />
      <div>
        <HeroSection />
        <NumbersMarketPage />
        <ProjectsSection />
        <FaqSection />
        <ContactForm />
        {/* <PlateStaticSm
          data={{
            price: 1,
            firstLetter: "a",
            secondLetter: "a",
            thirdLetter: "a",
            firstDigit: "2",
            secondDigit: "2",
            thirdDigit: "2",
            comment: "hello",
            regionId: 122,
          }}
        /> */}
      </div>
    </>
  )
}
