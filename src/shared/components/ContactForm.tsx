import UiSelect from "@/shared/components/UiSelect"
import Toast from "@/shared/components/Toast"
import { useLeadSubmit, type LeadFormPayload } from "@/shared/hooks/useLeadSubmit"
import { useEffect, useState } from "react"

type LeadForm = LeadFormPayload

export default function ContactForm() {
  const { submit, loading, error, success } = useLeadSubmit()
  const [formData, setFormData] = useState<LeadForm>({
    name: "",
    phone: "",
    type: "",
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
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement
    const { name, value, type } = target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.consent) {
      setToast({ type: "error", msg: "Пожалуйста, согласитесь на обработку персональных данных." })
      return
    }
    const ok = await submit(formData)
    if (ok) setFormData({ name: "", phone: "", type: "", number: "", consent: false })
  }

  const isSubmitDisabled =
    loading || !formData.name.trim() || !formData.phone.trim() || !formData.type || !formData.consent

  return (
    <section className="bg-[#0B0B0C] text-white py-12 md:py-16">
      {toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}

      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <h2 className="text-center text-3xl md:text-4xl font-bold uppercase font-actay-wide">Оставьте заявку!</h2>
        <p className="text-center text-neutral-300 mt-2 text-sm md:text-base">
          Все сделки сопровождаются юридической поддержкой, а номера подбираются только из проверенных источников.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Имя *"
              className="w-full bg-[#F8F9FA] text-black placeholder-[#777] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#1E63FF]"
            />

            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Телефон *"
              inputMode="tel"
              className="w-full bg-[#F8F9FA] text-black placeholder-[#777] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#1E63FF]"
            />

            <UiSelect
              name="type"
              value={formData.type}
              onChange={(v) => setFormData((p) => ({ ...p, type: v as LeadForm["type"] }))}
              placeholder="Выберите действие *"
              options={[
                { label: "Купить номер", value: "buy" },
                { label: "Продать номер", value: "sell" },
              ]}
            />

            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Автомобильный номер (необязательно)"
              className="w-full bg-[#F8F9FA] text-black placeholder-[#777] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#1E63FF]"
            />
          </div>

            <label className="flex items-start gap-3 text-sm select-none cursor-pointer">
              <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 accent-[#1E63FF]"
              />
              <a href='#' className="text-[#1E63FF] flex items-center">
              Я согласен на обработку персональных данных <span className="text-[#EB5757] ml-1">*</span>
              </a>
            </label>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="rounded-full w-full sm:w-auto px-10 py-3 bg-[#1E63FF] hover:bg-[#1557E0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors duration-300"
            >
              {loading ? "Отправка..." : "Отправить"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
