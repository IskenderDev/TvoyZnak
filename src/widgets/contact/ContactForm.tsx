import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import { useLocation } from "react-router-dom"
import Toast from "@/shared/components/Toast"
import ConsentNotice from "@/shared/components/ConsentNotice"
import { useLeadSubmit, type LeadFormPayload } from "@/shared/hooks/useLeadSubmit"
import UiSelect from "@/shared/components/UiSelect"
import PhoneInput from "@/shared/ui/PhoneInput"
import { isPhoneComplete, normalizePhone } from "@/shared/lib/phone"

export default function ContactForm() {
  const { submit, loading, error, success } = useLeadSubmit()
  const location = useLocation()

  const [formData, setFormData] = useState<LeadFormPayload>({
    fullName: "",
    phoneNumber: "",
    feedbackType: "buy",
    carNumber: "",
  })

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [phoneError, setPhoneError] = useState<string>("")

  useEffect(() => {
    if (error) setToast({ type: "error", msg: `Не удалось отправить: ${error}` })
    if (success) setToast({ type: "success", msg: "Заявка успешно отправлена!" })
  }, [error, success])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    const state = (location.state as { leadPrefill?: Partial<LeadFormPayload> } | null)?.leadPrefill || {}
    const params = new URLSearchParams(location.search)

    type PrefillKey = "fullName" | "phoneNumber" | "carNumber" | "feedbackType"
    const allowedKeys: PrefillKey[] = ["fullName", "phoneNumber", "carNumber", "feedbackType"]

    const fromParams: Partial<Record<PrefillKey, string>> = {}
    allowedKeys.forEach((key) => {
      const value = params.get(key)
      if (value) fromParams[key] = value
    })

    const fromState = allowedKeys.reduce<Partial<Record<PrefillKey, string>>>((acc, key) => {
      const value = state[key]
      if (typeof value === "string" && value.trim()) acc[key] = value
      return acc
    }, {})

    const merged: Partial<Record<PrefillKey, string>> = { ...fromParams, ...fromState }
    const hasValues = allowedKeys.some((key) => {
      const value = merged[key]
      return typeof value === "string" && value.trim()
    })

    if (!hasValues) return

    setFormData((prev) => ({
      ...prev,
      ...(merged.fullName ? { fullName: merged.fullName } : {}),
      ...(merged.phoneNumber ? { phoneNumber: normalizePhone(merged.phoneNumber) } : {}),
      ...(merged.carNumber ? { carNumber: merged.carNumber } : {}),
      ...(merged.feedbackType ? { feedbackType: merged.feedbackType } : {}),
    }))
  }, [location.key, location.search, location.state])

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
    if (!isPhoneComplete(formData.phoneNumber)) {
      setPhoneError("Введите номер телефона полностью")
      return
    }

    const ok = await submit(formData)
    if (ok) {
      setPhoneError("")
      setFormData({ fullName: "", phoneNumber: "", feedbackType: "buy", carNumber: "" })
    }
  }

  const isSubmitDisabled =
    loading ||
    !formData.fullName.trim() ||
    !isPhoneComplete(formData.phoneNumber) ||
    !formData.feedbackType

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
        className="w-full rounded-4xl bg-white text-black placeholder-[#7A7A7A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
      />

      <PhoneInput
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={(value) => {
          setFormData((prev) => ({ ...prev, phoneNumber: value }))
          if (phoneError && isPhoneComplete(value)) {
            setPhoneError("")
          }
        }}
        placeholder="Телефон *"
        required
        className="w-full rounded-4xl bg-white text-black placeholder-[#7A7A7A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
      />
      {phoneError ? <p className="text-xs text-[#EB5757]">{phoneError}</p> : null}

      <input
        type="text"
        name="carNumber"
        value={formData.carNumber}
        onChange={handleChange}
        placeholder="Гос. номер (необязательно)"
        className="w-full rounded-4xl bg-white text-black placeholder-[#7A7A7A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
      />

      <UiSelect<LeadFormPayload["feedbackType"]>
        name="feedbackType"
        value={formData.feedbackType}
        onChange={(v) => setFormData((prev) => ({ ...prev, feedbackType: v }))}
        options={contactOptions}
        placeholder="Выберите действие"
        className="w-full bg-white text-black rounded-4xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0177FF]"
        valueClassName="text-black"
        placeholderClassName="text-[#7A7A7A]"
      />

      <ConsentNotice className="text-[#94A3B8]" />

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full rounded-4xl bg-[#0177FF] hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 font-medium transition"
      >
        {loading ? "Отправка..." : "Отправить"}
      </button>
    </form>
  )
}
