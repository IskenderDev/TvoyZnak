import UiSelect from "@/shared/components/UiSelect"
import Toast from "@/shared/components/Toast"
import { useLeadSubmit, type LeadFormPayload } from "@/shared/hooks/useLeadSubmit"
import { useFeedbackTypes } from "@/shared/hooks/useFeedbackTypes"
import { useEffect, useMemo, useState } from "react"

type LeadForm = LeadFormPayload

export default function ContactForm() {
  const { submit, loading, error, success } = useLeadSubmit()
  const {
    options: typeOptions,
    loading: typesLoading,
    error: typesError,
  } = useFeedbackTypes()
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

  const selectOptions = useMemo(() => {
    if (!typeOptions.length) {
      return [
        { label: "Купить номер", value: "buy" },
        { label: "Продать номер", value: "sell" },
      ] as const
    }
    return typeOptions
  }, [typeOptions])

  useEffect(() => {
    if (!selectOptions.length) return
    setFormData((prev) => {
      if (prev.type) return prev
      return { ...prev, type: selectOptions[0].value }
    })
  }, [selectOptions])

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
    const ok = await submit({
      name: formData.name,
      phone: formData.phone,
      type: formData.type,
      number: formData.number,
      consent: formData.consent,
      message: formData.number ? `Интересующий номер: ${formData.number}` : undefined,
    })
    if (ok)
      setFormData({ name: "", phone: "", type: "", number: "", consent: false })
  }

  const isSubmitDisabled =
    loading ||
    !formData.name.trim() ||
    !formData.phone.trim() ||
    !formData.type ||
    !formData.consent ||
    typesLoading

  return (
    <section className="bg-background text-foreground py-12 md:py-16">
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
              className="w-full rounded-lg bg-surface px-4 py-3 text-foreground placeholder:text-muted/80 outline-none focus:ring-2 focus:ring-primary-500"
            />

            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Телефон *"
              inputMode="tel"
              className="w-full rounded-lg bg-surface px-4 py-3 text-foreground placeholder:text-muted/80 outline-none focus:ring-2 focus:ring-primary-500"
            />

            <div className="space-y-1">
              <UiSelect
                name="type"
                value={formData.type}
                onChange={(v) => setFormData((p) => ({ ...p, type: v }))}
                placeholder={typesLoading ? "Загрузка..." : "Выберите действие *"}
                options={selectOptions as { label: string; value: string }[]}
              />
              {typesError && (
                <p className="text-xs text-danger">{typesError}</p>
              )}
            </div>

            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Автомобильный номер (необязательно)"
              className="w-full rounded-lg bg-surface px-4 py-3 text-foreground placeholder:text-muted/80 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-primary-300 select-none">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="h-4 w-4 accent-primary-500"
            />
            Я согласен на обработку персональных данных<span className="text-danger">*</span>
          </label>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full rounded-full bg-primary-500 px-10 py-3 font-medium text-primary-foreground transition-colors duration-300 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? "Отправка..." : "Отправить"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
