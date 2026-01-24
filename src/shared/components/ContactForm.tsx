import UiSelect from "@/shared/components/UiSelect"
import Toast from "@/shared/components/Toast"
import ConsentNotice from "@/shared/components/ConsentNotice"
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
    fullName: "",
    phoneNumber: "",
    feedbackType: "",
    carNumber: "",
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
      if (prev.feedbackType) return prev
      return { ...prev, feedbackType: selectOptions[0].value }
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
    const ok = await submit({
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      feedbackType: formData.feedbackType,
      carNumber: formData.carNumber,
    })
    if (ok) setFormData({ fullName: "", phoneNumber: "", feedbackType: "", carNumber: "" })
  }

  const isSubmitDisabled =
    loading ||
    !formData.fullName.trim() ||
    !formData.phoneNumber.trim() ||
    !formData.feedbackType ||
    typesLoading

  return (
    <section className="text-white py-12 md:py-16">
      {toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}

      <div className="max-w-[980px] mx-auto px-5 sm:px-8">
        {/* approx font-size: 28/36 */}
        <h2 className="text-center text-[24px] md:text-[32px] font-extrabold uppercase">
          Оставьте заявку!
        </h2>
        <p className="text-center text-white/70 mt-2 text-[12px] md:text-[14px]">
          Все сделки сопровождаются юридической поддержкой, а номера подбираются только из
          проверенных источников.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 md:mt-8 bg-white rounded-[22px] px-5 sm:px-6 md:px-8 py-6 md:py-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Имя *"
              className="w-full bg-[#F4F5F7] text-black placeholder-[#7A7A7A] rounded-full px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#1E63FF]"
            />

            <input
              type="tel"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Телефон *"
              inputMode="tel"
              className="w-full bg-[#F4F5F7] text-black placeholder-[#7A7A7A] rounded-full px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#1E63FF]"
            />

            <div className="space-y-1">
              <UiSelect
                name="feedbackType"
                value={formData.feedbackType}
                onChange={(v) => setFormData((p) => ({ ...p, feedbackType: v }))}
                placeholder={typesLoading ? "Загрузка..." : "Выберите действие *"}
                options={selectOptions as { label: string; value: string }[]}
              />
              {typesError && <p className="text-xs text-[#EB5757]">{typesError}</p>}
            </div>

            <input
              type="text"
              name="carNumber"
              value={formData.carNumber}
              onChange={handleChange}
              placeholder="Автомобильный номер (необязательно)"
              className="w-full bg-[#F4F5F7] text-black placeholder-[#7A7A7A] rounded-full px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#1E63FF]"
            />
          </div>

          <ConsentNotice className="text-[#64748B] mt-4" />

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="rounded-full w-full sm:w-auto px-10 py-3 bg-[#1E63FF] hover:bg-[#1557E0] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold transition-colors duration-300"
            >
              {loading ? "Отправка..." : "Отправить"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
