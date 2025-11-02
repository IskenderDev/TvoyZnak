import Seo from "@/shared/components/Seo"
import ContactSection from '@/widgets/contact/ContactSection'


export default function ContactsPage() {
  return (
    <>
      <Seo
        title="Контакты — Знак отличия"
        description="Свяжитесь с нами удобным способом — оставьте заявку, позвоните или напишите, и мы подберём удобный формат общения."
      />

      <ContactSection />
    </>
  )
}
