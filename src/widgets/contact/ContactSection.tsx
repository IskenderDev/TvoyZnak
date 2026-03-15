import ContactForm from "./ContactForm"
import ContactChannels from "./ContactChannels"

export default function ContactSection() {
  return (
    <section className="text-white pb-10 desktop:pb-14">
      <div className="max-w-[1100px] mx-auto px-5 desktop:px-6">
        <h2 className="text-center font-bold uppercase leading-tight text-[22px] desktop:text-[36px]">
          <span className="text-[#0177FF]">СВЯЖИТЕСЬ С НАМИ</span> УДОБНЫМ СПОСОБОМ — МЫ
          <br /> ЦЕНИМ ВАШЕ ВРЕМЯ И ГОТОВЫ К ДИАЛОГУ
        </h2>

        <p className="mt-4 text-center text-white/80 text-sm desktop:text-lg max-w-[820px] mx-auto">
          Мы находимся на связи ежедневно и готовы ответить на все ваши вопросы. Вы можете
          оставить заявку на сайте, позвонить или написать нам — мы подберём удобный способ
          общения и поможем решить вашу задачу.
        </p>

        <div className="mt-8 desktop:mt-10 rounded-2xl bg-[#202020] px-5 desktop:px-8 py-6 desktop:py-7">
          <div className="grid grid-cols-1 desktop:grid-cols-[minmax(320px,1fr)_360px] gap-6 desktop:gap-8 items-start">
            <ContactForm />
            <ContactChannels />
          </div>
        </div>
      </div>
    </section>
  )
}
