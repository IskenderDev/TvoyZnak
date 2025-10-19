import React, { useEffect, useRef, useState } from "react";

export type PlateData = {
  price: number;
  firstLetter: string;
  secondLetter: string;
  thirdLetter: string;
  firstDigit: string;
  secondDigit: string;
  thirdDigit: string;
  comment: string;
  regionId: number;
};

type Props = {
  data: PlateData;
  responsive?: boolean;
  flagSrc?: string;
  showCaption?: boolean;
  className?: string;
};

const W = 250;

export default function  PlateStaticSm({
  data,
  responsive = true,
  flagSrc = "/flag-russia.svg",
  showCaption = true,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [k, setK] = useState(1);

  useEffect(() => {
    const el = ref.current;
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
      const scale = (w || el.clientWidth) / W;
      setK(scale > 0 ? scale : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const borderW = 2;
  const radius = Math.max(4, 8 * k);

  const leftWidth = "72%";
  const rightWidth = "28%";

  const mainFontNumbers = 48 * k;
  const mainFont = 38 * k;
  const mainPx = 10 * k;
  const mainPb = 12 * k;
  const mainGap = 8 * k;
  const digitGap = 2 * k;

  const regionFont = 30 * k;
  const rusFont = 11 * k;
  const rusRowH = 16 * k;
  const rusGap = 4;
  const rusPb = 1;
  const flagH = 14 * k;
  const flagBorder = 0.1;

  const captionFs = 13 * k;

  const containerStyle: React.CSSProperties = responsive
    ? { width: "100%", maxWidth: `${W}px` }
    : { width: `${W}px` };

  return (
    <figure className={`flex flex-col ${className} text-black`} style={containerStyle}>
      <div ref={ref} className="w-full">
        <div
          className="flex flex-col rounded-xl bg-black box-border"
          style={{ border: `${borderW}px solid #000`, borderRadius: radius }}
        >
          <div className="flex w-full bg-black rounded-xl font-road">
            <div
              className="flex items-end justify-center bg-white font-bold lowercase"
              style={{
                width: leftWidth,
                border: `${borderW}px solid #000`,
                borderRadius: radius,
                paddingLeft: mainPx,
                paddingRight: mainPx,
                paddingBottom: mainPb,
                gap: mainGap,
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: mainFont, lineHeight: 0.4 }}>
                {data.firstLetter ?? "*"}
              </span>

              <div className="flex" style={{ fontSize: mainFontNumbers, lineHeight: 0.5, gap: digitGap }}>
                <span>{data.firstDigit ?? "*"}</span>
                <span>{data.secondDigit ?? "*"}</span>
                <span>{data.thirdDigit ?? "*"}</span>
              </div>

              <div className="flex" style={{ fontSize: mainFont, lineHeight: 0.4, gap: digitGap }}>
                <span>{data.secondLetter ?? "*"}</span>
                <span>{data.thirdLetter ?? "*"}</span>
              </div>
            </div>

            <div
              className="flex flex-col items-center bg-white"
              style={{
                width: rightWidth,
                border: `${borderW}px solid #000`,
                borderRadius: radius,
                paddingBottom: 4 * k,
                justifyContent: "space-between",
                gap: 4 * k,
                boxSizing: "border-box",
              }}
            >
              <p className="font-bold" style={{ fontSize: regionFont, lineHeight: 1, }}>
                {String(data.regionId ?? "*")}
              </p>

              <p
                className="flex items-center justify-center"
                style={{ height: rusRowH, gap: rusGap, paddingBottom: rusPb, }}
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

          {showCaption && (
            <div
              className="w-full text-white text-center uppercase font-actay-druk italic font-extrabold"
              style={{ fontSize: captionFs }}
            >
              ЗНАК ОТЛИЧИЯ
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
