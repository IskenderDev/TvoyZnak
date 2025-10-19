import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import Toast from "@/shared/components/Toast"
import { useLeadSubmit, type LeadFormPayload } from "@/shared/hooks/useLeadSubmit"
import UiSelect from "@/shared/components/UiSelect"

export default function ContactForm() {
  const { submit, loading, error, success } = useLeadSubmit()

  const [formData, setFormData] = useState<LeadFormPayload>({
    fullName: "",
    phoneNumber: "",
    feedbackType: "buy",
    carNumber: "",
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

  const contactOptions = useMemo(
    () =>
      [
        { label: "Купить номер", value: "buy" },
        { label: "Продать номер", value: "sell" },
      ] as { label: string; value: LeadFormPayload["feedbackType"] }[],
    []
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.consent) {
      setToast({ type: "error", msg: "Пожалуйста, согласитесь на обработку персональных данных." })
      return
    }
    const ok = await submit(formData)
    if (ok)
      setFormData({ fullName: "", phoneNumber: "", feedbackType: "buy", carNumber: "", consent: false })
  }

  const isSubmitDisabled =
    loading ||
    !formData.fullName.trim() ||
    !formData.phoneNumber.trim() ||
    !formData.feedbackType ||
    !formData.consent

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}

      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Имя *"
        required
        className="w-full rounded-lg bg-white text-black placeholder-[#7A7A7A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
      />

      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Телефон *"
        required
        className="w-full rounded-lg bg-white text-black placeholder-[#7A7A7A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
      />

      <input
        type="text"
        name="carNumber"
        value={formData.carNumber}
        onChange={handleChange}
        placeholder="Гос. номер *"
        required
        className="w-full rounded-lg bg-white text-black placeholder-[#7A7A7A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
      />

      <UiSelect<LeadFormPayload["feedbackType"]>
        name="feedbackType"
        value={formData.feedbackType}
        onChange={(v) => setFormData((prev) => ({ ...prev, feedbackType: v }))}
        options={contactOptions}
        placeholder="Выберите действие"
        className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
        valueClassName="text-black"
        placeholderClassName="text-[#7A7A7A]"
      />

      <label className="flex items-center gap-2 text-xs text-[#6AA3FF] select-none">
        <input
          type="checkbox"
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
          className="accent-[#0177FF] w-4 h-4 "
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
  )
}
