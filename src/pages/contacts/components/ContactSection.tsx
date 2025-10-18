import Toast from "@/shared/components/Toast"
import { useLeadSubmit, type LeadFormPayload } from "@/shared/hooks/useLeadSubmit"
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react"

export default function ContactSection() {
  const { submit, loading, error, success } = useLeadSubmit()
  const [formData, setFormData] = useState<LeadFormPayload>({
    name: "",
    phone: "",
    type: "buy",
    number: "",
    consent: false,
  })
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  useEffect(() => {
    if (error) setToast({ type: "error", msg: `Не удалось отправить: ${error}` })
    if (success) setToast({ type: "success", msg: "Заявка успешно отправлена!" })
  }, [error, success])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const contactOptions = useMemo(
    () => [
      { label: "Купить номер", value: "buy" as LeadFormPayload["type"] },
      { label: "Продать номер", value: "sell" as LeadFormPayload["type"] },
    ],
    []
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement
    const { name, value, type } = target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.consent) {
      setToast({ type: "error", msg: "Пожалуйста, согласитесь на обработку персональных данных." })
      return
    }
    const ok = await submit(formData)
    if (ok) {
      setFormData({ name: "", phone: "", type: "buy", number: "", consent: false })
    }
  }

  const isSubmitDisabled =
    loading || !formData.name.trim() || !formData.phone.trim() || !formData.type || !formData.consent

  return (
    <section className="text-white py-10 sm:py-14">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
        <h2 className="text-center font-actay-wide font-extrabold uppercase leading-tight text-[22px] sm:text-[28px]">
          СВЯЖИТЕСЬ <span className="text-[#0177FF]">С НАМИ</span> УДОБНЫМ СПОСОБОМ — МЫ
          <br /> ЦЕНИМ ВАШЕ ВРЕМЯ И ГОТОВЫ К ДИАЛОГУ
        </h2>

        <p className="mt-4 text-center text-white/80 text-sm sm:text-base max-w-[820px] mx-auto">
          Мы находимся на связи ежедневно и готовы ответить на все ваши вопросы. Вы можете
          оставить заявку на сайте, позвонить или написать нам — мы подберём удобный способ
          общения и поможем решить вашу задачу.
        </p>

        <div className="mt-8 sm:mt-10 rounded-2xl bg-[#202020] px-5 sm:px-8 py-6 sm:py-7">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(320px,1fr)_360px] gap-6 sm:gap-8 items-start">
            <form onSubmit={handleSubmit} className="space-y-3">
              {toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Имя *"
                required
                className="w-full rounded-lg bg-white text-black placeholder-[#7A7A7A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Телефон *"
                required
                className="w-full rounded-lg bg-white text-black placeholder-[#7A7A7A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
              />
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Номер *"
                required
                className="w-full rounded-lg bg-white text-black placeholder-[#7A7A7A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
              />

              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-lg bg-white text-black px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#0177FF]"
                  required
                >
                  {contactOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/60">▾</span>
              </div>

              <label className="flex items-center gap-2 text-xs text-white/70 select-none">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="accent-[#0177FF] w-4 h-4"
                />
                Я согласен на обработку персональных данных<span className="text-[#EB5757]">*</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full rounded-lg bg-[#0177FF] hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 font-medium transition"
              >
                {loading ? "Отправка..." : "Отправить"}
              </button>
            </form>

            <div className="grid gap-4 sm:gap-5 content-start">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[#0177FF]">📞</span>
                <a href="tel:+79959202090" className="text-[15px] sm:text-base font-medium hover:text-[#0177FF] transition-colors">
                  +7 (995) 920-20-90
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[#0177FF]">✉️</span>
                <a href="mailto:znakonet@yandex.ru" className="text-[15px] sm:text-base font-medium hover:text-[#0177FF] transition-colors">
                  znakonet@yandex.ru
                </a>
              </div>

              <div className="flex items-center gap-3 pt-1">
                {[
                  { label: "VK", href: "https://vk.com/tvoyznak" },
                  { label: "TG", href: "https://t.me/tvoyznak" },
                  { label: "WA", href: "https://wa.me/79959202090" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="inline-flex size-10 items-center justify-center rounded-lg bg-[#0177FF] hover:brightness-95 transition"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="font-semibold">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
