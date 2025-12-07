import ContactForm from "./ContactForm"
import ContactChannels from "./ContactChannels"

export default function ContactSection() {
  return (
    <section className="text-white py-10 sm:py-14">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
        <h2 className="text-center font-extrabold uppercase leading-tight text-[22px] sm:text-[28px]">
          <span className="text-[#0177FF]">СВЯЖИТЕСЬ С НАМИ</span> УДОБНЫМ СПОСОБОМ — МЫ
          <br /> ЦЕНИМ ВАШЕ ВРЕМЯ И ГОТОВЫ К ДИАЛОГУ
        </h2>

        <p className="mt-4 text-center text-white/80 text-sm sm:text-base max-w-[820px] mx-auto">
          Мы находимся на связи ежедневно и готовы ответить на все ваши вопросы. Вы можете
          оставить заявку на сайте, позвонить или написать нам — мы подберём удобный способ
          общения и поможем решить вашу задачу.
        </p>

        <div className="mt-8 sm:mt-10 rounded-2xl bg-[#202020] px-5 sm:px-8 py-6 sm:py-7">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(320px,1fr)_360px] gap-6 sm:gap-8 items-start">
            <ContactForm />
            <ContactChannels />
          </div>
        </div>
      </div>
    </section>
  )
}
