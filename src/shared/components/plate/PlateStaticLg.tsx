import React, { useEffect, useRef, useState } from "react";

import { format2 } from "@/shared/lib/format/format2";

export type PlateData = {
  price: number;
  firstLetter: string;
  secondLetter: string;
  thirdLetter: string;
  firstDigit: string;
  secondDigit: string;
  thirdDigit: string;
  comment: string;
  regionId: string | number;
};

type PlateSize = "sm" | "lg";

type Props = {
  data: PlateData;
  size?: PlateSize;
  responsive?: boolean;
  flagSrc?: string;
  showCaption?: boolean;
  className?: string;
};

const PRESETS = {
  sm: { w: 250, h: 65 },
  lg: { w: 879, h: 180 },
} as const;

export default function PlateStaticLg({
  data,
  size = "lg",
  responsive = true,
  flagSrc = "/flag-russia.svg",
  showCaption = true,
  className = "",
}: Props) {
  const preset = PRESETS[size];
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [k, setK] = useState(1); 

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const boxSize = entry.contentBoxSize;
      let inlineSize = entry.contentRect.width;

      if (Array.isArray(boxSize)) {
        inlineSize = boxSize[0]?.inlineSize ?? inlineSize;
      } else if (boxSize && typeof boxSize === "object" && "inlineSize" in boxSize) {
        const size = boxSize as unknown as ResizeObserverSize;
        inlineSize = size.inlineSize ?? inlineSize;
      }

      const w = inlineSize || el.clientWidth;
      const scale = (w || el.clientWidth) / preset.w;
      setK(scale > 0 ? scale : 1);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [preset.w]);
  const borderW = Math.max(1, 8 * k);            
  const radius = Math.max(6, 14 * k);
  const outerPadY = 6 * k;

  const mainFont = 180 * k;
  const mainFontLetter = 140 * k;
  const mainGap = 20 * k;
  const mainPx = 32 * k;
  const mainPb = 12 * k;
  const digitGap = 4 * k;                        

  const regionFont = 128 * k;
  const rusFont = 42 * k;                         
  const rusRowH = 40 * k;
  const rusGap = 10 * k;
  const rusPb = 4 * k;
  const flagH = rusRowH * 0.9;
  const flagBorder = Math.max(1, 2 * k);

  const captionFs = Math.max(10, 24 * k);         
  const captionMt = Math.max(4, 8 * k);

  const containerStyle: React.CSSProperties = responsive
    ? { width: "100%", maxWidth: `${preset.w}px` }
    : { width: `${preset.w}px` };

  return (
    <figure className={`flex flex-col ${className} text-black`} style={containerStyle}>
      <div ref={wrapperRef} className="w-full">
        <div
          className="flex flex-col rounded-xl bg-black box-border"
          style={{ border: `${borderW}px solid #000`, borderRadius: radius }}
        >
          <div className="flex w-full bg-black rounded-xl font-road">
            {/* Левая зона */}
            <div
              className="flex items-end justify-center bg-white font-bold lowercase"
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
                {data.firstLetter ?? ""}
              </span>

              <div
                className="flex num"
                style={{ fontSize: mainFont, lineHeight: 0.9, gap: digitGap }}
              >
                <span>{format2(data.firstDigit ?? "")}</span>
                <span>{format2(data.secondDigit ?? "")}</span>
                <span>{format2(data.thirdDigit ?? "")}</span>
              </div>

              <div className="flex" style={{ fontSize: mainFontLetter, lineHeight: 0.9, gap: digitGap }}>
                <span>{data.secondLetter ?? ""}</span>
                <span>{data.thirdLetter ?? ""}</span>
              </div>
            </div>

            <div
              className="flex flex-col items-center bg-white"
              style={{
                width: "30%",
                border: `${borderW}px solid #000`,
                borderRadius: radius,
                paddingTop: outerPadY,
                paddingBottom: outerPadY,
                justifyContent: "space-between",
                gap: 8 * k,
                boxSizing: "border-box",
              }}
            >
              <p
                className="font-bold num"
                style={{ fontSize: regionFont, lineHeight: 1, margin: 0 }}
              >
                {format2(data.regionId ?? "")}
              </p>

              <p
                className="flex items-center justify-center"
                style={{ height: rusRowH, gap: rusGap, paddingBottom: rusPb, margin: 0 }}
              >
                <span
                  className="font-extrabold font-actay-druk"
                  style={{ fontSize: rusFont, lineHeight: 1 }}
                >
                  RUS
                </span>
                <img
                  src={flagSrc}
                  alt="Russia"
                  style={{
                    height: flagH,
                    border: `${flagBorder}px solid #000`,
                    display: "block",
                  }}
                />
              </p>
            </div>
          </div>

          {/* подпись (масштабируемая) */}
          {showCaption && (
            <div
              className="w-full text-white text-center uppercase font-actay-druk italic font-extrabold"
              style={{ fontSize: captionFs, marginTop: captionMt }}
            >
              ЗНАК ОТЛИЧИЯ
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
