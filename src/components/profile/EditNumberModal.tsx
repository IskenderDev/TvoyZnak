import React, { useEffect, useMemo, useRef, useState } from "react"
import { FiX } from "react-icons/fi"

import Modal from "@/shared/ui/Modal"
import Toast from "@/shared/components/Toast"
import PlateSelectForm from "@/features/plate-select/ui/PlateSelectForm"
import { DEFAULT_PLATE_VALUE, type PlateSelectValue } from "@/features/plate-select/model/types"
import { numbersApi } from "@/shared/services/numbersApi"
import type { NumberItem } from "@/entities/number/types"
import type { AdminLot } from "@/shared/api/adminLots"
import { useStableViewportWidth } from "@/shared/lib/hooks/useStableViewport"

const INPUT_BASE =
  "bg-[#f9f9fa] text-black placeholder-[#777] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#1E63FF] border"

type ToastState = { type: "success" | "error"; msg: string } | null

export type EditNumberModalSubmitPayload = {
  originalPrice: number
  firstLetter: string
  secondLetter: string
  thirdLetter: string
  firstDigit: string
  secondDigit: string
  thirdDigit: string
  comment?: string
  regionId: number
}

type EditNumberModalLot = NumberItem | AdminLot

type EditNumberModalSubmitHandler<TLot extends EditNumberModalLot> = (
  lot: TLot,
  payload: EditNumberModalSubmitPayload,
) => Promise<TLot>

type EditNumberModalProps<TLot extends EditNumberModalLot> = {
  open: boolean
  lot: TLot | null
  onClose: () => void
  onUpdated: (lot: TLot) => void
  onSubmit?: (lot: TLot, payload: EditNumberModalSubmitPayload) => Promise<TLot>
}

const isNumberItem = (lot: EditNumberModalLot): lot is NumberItem => {
  return (lot as NumberItem).plate !== undefined
}

const toPlateValue = (lot: EditNumberModalLot | null): PlateSelectValue => {
  if (!lot) return { ...DEFAULT_PLATE_VALUE }

  if (isNumberItem(lot)) {
    const { plate, region } = lot
    const text = [
      plate.firstLetter || "*",
      plate.firstDigit || "*",
      plate.secondDigit || "*",
      plate.thirdDigit || "*",
      plate.secondLetter || "*",
      plate.thirdLetter || "*",
    ].join("")

    return {
      text,
      regionCode: region || "",
      regionId: (() => {
        const numeric = Number(plate.regionId)
        return Number.isFinite(numeric) && numeric > 0 ? numeric : null
      })(),
    }
  }

  const text = [
    lot.firstLetter || "*",
    lot.firstDigit || "*",
    lot.secondDigit || "*",
    lot.thirdDigit || "*",
    lot.secondLetter || "*",
    lot.thirdLetter || "*",
  ].join("")

  return {
    text,
    regionCode: lot.regionCode || "",
    regionId: lot.regionId ?? null,
  }
}

const extractPlateParts = (value: PlateSelectValue) => {
  const text = (value.text || "******").toUpperCase()

  return {
    firstLetter: text[0] ?? "",
    firstDigit: text[1] ?? "",
    secondDigit: text[2] ?? "",
    thirdDigit: text[3] ?? "",
    secondLetter: text[4] ?? "",
    thirdLetter: text[5] ?? "",
  }
}

const normalizePrice = (value: string): number => {
  if (!value) return NaN
  const normalized = value.replace(/[^0-9.,]/g, "").replace(/,/g, ".")
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : NaN
}

const normalizePlateText = (value: string): string => {
  return (value ?? "").replace(/\s+/g, "").replace(/-/g, "").toUpperCase()
}

const getInitialPrice = (lot: EditNumberModalLot | null) => {
  if (!lot) return ""
  const value = lot.originalPrice
  if (!Number.isFinite(value) || value <= 0) return ""
  return String(value)
}

const getInitialComment = (lot: EditNumberModalLot | null) => {
  if (!lot) return ""
  if (isNumberItem(lot)) return lot.plate.comment ?? lot.description ?? ""
  return lot.comment ?? ""
}

const getRegionIdValue = (plate: PlateSelectValue): number => {
  const fromId = plate.regionId != null ? Number(plate.regionId) : NaN
  if (Number.isFinite(fromId) && fromId > 0) return fromId

  const fromCode = Number(plate.regionCode)
  if (Number.isFinite(fromCode) && fromCode > 0) return fromCode

  return NaN
}

export default function EditNumberModal<TLot extends EditNumberModalLot>({
  open,
  lot,
  onClose,
  onUpdated,
  onSubmit,
}: EditNumberModalProps<TLot>) {
  const [plate, setPlate] = useState<PlateSelectValue>(() => toPlateValue(lot))
  const [price, setPrice] = useState<string>(() => getInitialPrice(lot))
  const [comment, setComment] = useState<string>(() => getInitialComment(lot))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState>(null)

  const { width: viewportWidth, recalc: recalcViewport } = useStableViewportWidth()
  const plateSize = useMemo<"xs" | "lg">(() => (viewportWidth < 640 ? "xs" : "lg"), [viewportWidth])

  const priceInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timeout)
  }, [toast])

  const lotId = useMemo(() => {
    if (!lot) return null
    return (lot as any).id ?? null
  }, [lot])

  useEffect(() => {
    if (!open) return

    setPlate(toPlateValue(lot))
    setPrice(getInitialPrice(lot))
    setComment(getInitialComment(lot))
    setError(null)

    requestAnimationFrame(() => recalcViewport())

    queueMicrotask(() => {
      if (!priceInputRef.current) return
      const el = priceInputRef.current
      el.focus()
      const len = el.value.length
      el.setSelectionRange(len, len)
    })
  }, [open, lotId, recalcViewport, lot])

  const isSubmitDisabled = useMemo(() => {
    if (!open) return true

    const originalPriceValue = normalizePrice(price)
    const plateText = normalizePlateText(plate.text)
    const plateOk = plateText.length === 6 && !plateText.includes("*")

    const regionIdValue = getRegionIdValue(plate)
    const regionOk = Number.isFinite(regionIdValue) && regionIdValue > 0

    return loading || !Number.isFinite(originalPriceValue) || originalPriceValue <= 0 || !plateOk || !regionOk
  }, [loading, open, plate.regionCode, plate.regionId, plate.text, price])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (!lot) return

    const originalPriceValue = normalizePrice(price)
    if (!Number.isFinite(originalPriceValue) || originalPriceValue <= 0) {
      setError("Укажите корректную стоимость")
      return
    }

    const plateText = normalizePlateText(plate.text)
    if (plateText.length !== 6 || plateText.includes("*")) {
      setError("Укажите полный номер без символов *")
      return
    }

    const regionIdValue = getRegionIdValue(plate)
    if (!Number.isFinite(regionIdValue) || regionIdValue <= 0) {
      setError("Выберите регион")
      return
    }

    const parts = extractPlateParts({ ...plate, text: plateText })
    setLoading(true)
    setError(null)

    try {
      const payload: EditNumberModalSubmitPayload = {
        originalPrice: originalPriceValue,
        firstLetter: parts.firstLetter,
        firstDigit: parts.firstDigit,
        secondDigit: parts.secondDigit,
        thirdDigit: parts.thirdDigit,
        secondLetter: parts.secondLetter,
        thirdLetter: parts.thirdLetter,
        comment: comment.trim() ? comment.trim() : undefined,
        regionId: regionIdValue,
      }

      const submit: EditNumberModalSubmitHandler<TLot> = onSubmit
        ? onSubmit
        : ((defaultSubmit as unknown) as EditNumberModalSubmitHandler<TLot>)

      const updated = await submit(lot, payload)
      onUpdated(updated)
      setToast({ type: "success", msg: "Изменения сохранены" })
      onClose()
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "Не удалось обновить объявление")
      setError(message)
      setToast({ type: "error", msg: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {toast ? <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} /> : null}

      <Modal open={open && Boolean(lot)} onClose={handleClose}>
        {/* сама модалка шириной до 1200px */}
        <div className="relative max-h-[90vh] w-full max-w-[1200px] overflow-hidden rounded-[32px] bg-[#fff] text-black shadow-2xl">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-black transition hover:bg-white/20"
            aria-label="Закрыть окно редактирования"
          >
            <FiX className="h-5 w-5" />
          </button>

          <div className="max-h-[90vh] overflow-y-auto px-6 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
            {/* контент тоже до 1200px */}
            <div className="mx-auto w-full max-w-[1200px]">
              <h2 className="text-center text-2xl uppercase sm:text-3xl md:text-4xl">
                Изменение объявления
              </h2>
              <p className="mt-3 text-center text-sm text-black/70 md:text-base">
                Обновите данные номера и сохраните изменения.
              </p>

              <div className="mt-6 md:mt-8">
                <PlateSelectForm
                  size={plateSize}
                  responsive
                  className="mx-auto"
                  flagSrc="/flag-russia.svg"
                  showCaption
                  value={plate}
                  onChange={setPlate}
                />
              </div>

              {/* форма теперь шире — до 960px, чтобы инпуты растянулись */}
              <form
                className="mt-6 w-full max-w-[960px] mx-auto space-y-6 md:mt-8"
                onSubmit={handleSubmit}
              >
                <input
                  ref={priceInputRef}
                  type="text"
                  inputMode="numeric"
                  className={`${INPUT_BASE} w-full`}
                  placeholder="Стоимость *"
                  aria-label="Стоимость"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />

                <textarea
                  className={`${INPUT_BASE} w-full min-h-[110px] resize-y`}
                  placeholder="Комментарий"
                  aria-label="Комментарий"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />

                {error ? <p className="text-sm text-[#EB5757]">{error}</p> : null}

                <div className="flex justify-center md:justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-full rounded-full bg-[#1E63FF] px-10 py-3 font-medium text-white transition-colors hover:bg-[#1557E0] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {loading ? "Сохраняем..." : "Сохранить изменения"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) return error

  if (error && typeof error === "object") {
    const withMessage = error as {
      message?: unknown
      response?: { data?: { message?: unknown; error?: unknown } }
    }

    const responseMessage = withMessage.response?.data?.message
    const responseError = withMessage.response?.data?.error
    const message = withMessage.message

    if (typeof responseMessage === "string" && responseMessage.trim()) return responseMessage
    if (typeof responseError === "string" && responseError.trim()) return responseError
    if (typeof message === "string" && message.trim()) return message
  }

  return fallback
}

const defaultSubmit: EditNumberModalSubmitHandler<NumberItem> = async (lot, payload) => {
  return numbersApi.updateAuthorized(lot.id, {
    originalPrice: payload.originalPrice,
    firstLetter: payload.firstLetter,
    firstDigit: payload.firstDigit,
    secondDigit: payload.secondDigit,
    thirdDigit: payload.thirdDigit,
    secondLetter: payload.secondLetter,
    thirdLetter: payload.thirdLetter,
    comment: payload.comment,
    regionId: payload.regionId,
  })
}