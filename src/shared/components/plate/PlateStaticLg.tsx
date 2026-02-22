import React from "react"
import { formatRegionCode } from "@/shared/lib/plate"

export type PlateData = {
  price: number
  firstLetter: string
  secondLetter: string
  thirdLetter: string
  firstDigit: string
  secondDigit: string
  thirdDigit: string
  comment: string
  regionId: string | number | null
}

type PlateSize = "sm" | "lg"

type Props = {
  data: PlateData
  size?: PlateSize
  responsive?: boolean
  flagSrc?: string
  showCaption?: boolean
  className?: string
}

const PRESETS = {
  sm: { w: 250, h: 65 },
  lg: { w: 879, h: 180 },
} as const

export default function PlateStaticLg({
  data,
  size = "lg",
  responsive = true,
  flagSrc = "/flag-russia.svg",
  className = "",
}: Props) {
  const preset = PRESETS[size]
  const [k, setK] = React.useState(1)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)

  const regionLabel = formatRegionCode(data.regionId) || ""
  const firstLetter = (data.firstLetter || "").toUpperCase()
  const secondLetter = (data.secondLetter || "").toUpperCase()
  const thirdLetter = (data.thirdLetter || "").toUpperCase()

  React.useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const ro = new ResizeObserver(([entry]) => {
      const boxSize = entry.contentBoxSize
      let inlineSize = entry.contentRect.width

      if (Array.isArray(boxSize)) {
        inlineSize = boxSize[0]?.inlineSize ?? inlineSize
      } else if (boxSize && typeof boxSize === "object" && "inlineSize" in boxSize) {
        const size = boxSize as unknown as ResizeObserverSize
        inlineSize = size.inlineSize ?? inlineSize
      }

      const w = inlineSize || el.clientWidth
      const scale = (w || el.clientWidth) / preset.w
      setK(scale > 0 ? scale : 1)
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [preset.w])

  // Масштаб как в PlateSelectForm: считаем от базового lg
  const baseWidth = PRESETS.lg.w
  const sizeRatio = preset.w / baseWidth
  const scale = k * sizeRatio

  const borderW = Math.max(1, 5 * scale)
  const radius = Math.max(6, 14 * scale)
  const outerPadY = 6 * scale

  const mainFontBase = 160 * scale
  const mainFontLetter = mainFontBase
  const mainFontNumber = mainFontBase

  const mainGap = 30 * scale
  const mainPx = 32 * scale
  const mainPb = 0
  const digitGap = 0 * scale
  const digitGapLetter = 0 * scale

  const regionFont = 110 * scale
  const rusFont = 42 * scale
  const rusRowH = 40 * scale
  const rusGap = 10 * scale
  const rusPb = 4 * scale
  const flagH = rusRowH * 0.9
  const regionGap = 4 * scale

  const containerStyle: React.CSSProperties = responsive
    ? { width: "100%", maxWidth: `${preset.w}px` }
    : { width: `${preset.w}px` }

  return (
    <figure className={`flex flex-col ${className} text-black`} style={containerStyle}>
      <div ref={wrapperRef} className="w-full">
        <div
          className="flex flex-col rounded-xl bg-black box-border"
          style={{
            border: `${borderW}px solid #000`,
            borderRadius: radius,
            height: `${preset.h}px`,
          }}
        >
          <div
            className="flex w-full bg-black rounded-xl font-auto-number"
            style={{ height: "100%" }}
          >
            <div
              className="flex items-end justify-center bg-white uppercase"
              style={{
                width: "70%",
                border: `${borderW}px solid #000`,
                borderRadius: radius,
                paddingLeft: mainPx,
                paddingRight: mainPx,
                paddingBottom: mainPb,
                gap: mainGap,
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: mainFontLetter, lineHeight: 0.9 }}>
                {firstLetter}
              </span>

              <div
                className="flex"
                style={{ fontSize: mainFontNumber, lineHeight: 0.9, gap: digitGap }}
              >
                <span>{data.firstDigit ?? ""}</span>
                <span>{data.secondDigit ?? ""}</span>
                <span>{data.thirdDigit ?? ""}</span>
              </div>

              <div
                className="flex"
                style={{ fontSize: mainFontLetter, lineHeight: 0.9, gap: digitGapLetter }}
              >
                <span>{secondLetter}</span>
                <span>{thirdLetter}</span>
              </div>
            </div>

            <div
              className="flex flex-col items-center mx-auto bg-white"
              style={{
                width: "30%",
                border: `${borderW}px solid #000`,
                borderRadius: radius,
                paddingTop: outerPadY,
                paddingBottom: outerPadY,
                justifyContent: "center",
                gap: regionGap,
                boxSizing: "border-box",
              }}
            >
              <p
                style={{ fontSize: regionFont, lineHeight: 1, margin: 0 }}
              >
                {regionLabel || "*"}
              </p>

              <p
                className="flex items-center justify-center m-0"
                style={{ height: rusRowH, gap: rusGap, paddingBottom: rusPb }}
              >
                <span
                  className="font-medium font-manrope"
                  style={{ fontSize: rusFont, lineHeight: 1 }}
                >
                  RUS
                </span>
                <img
                  src={flagSrc}
                  alt="Russia"
                  style={{
                    height: flagH,
                    display: "block",
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}
