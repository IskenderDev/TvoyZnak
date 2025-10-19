import React from "react";
import { PRESETS, LETTERS, DIGITS, REGIONS_RF, type PlateSize } from "../../../shared/components/plate/constants";
import { useScale } from "../../../shared/components/plate/useScale";
import SlotSelect from "../../../shared/components/plate/SlotSelect";
import { DEFAULT_PLATE_VALUE, type PlateSelectValue } from "../model/types";

type Props = {
  size?: PlateSize;
  responsive?: boolean;
  flagSrc?: string;
  showCaption?: boolean;
  className?: string;
  value?: PlateSelectValue;
  defaultValue?: PlateSelectValue;
  onChange?: (value: PlateSelectValue) => void;
};

const ensureChar = (char: string | undefined, allowed: readonly string[]) => {
  if (char && allowed.includes(char)) return char;
  return "*";
};

const normalizeValue = (value?: PlateSelectValue): PlateSelectValue => {
  const base = value ?? DEFAULT_PLATE_VALUE;
  const rawText = ((base.text ?? DEFAULT_PLATE_VALUE.text).toUpperCase() + "******").slice(0, 6);
  const normalizedChars: [string, string, string, string, string, string] = [
    ensureChar(rawText[0], LETTERS),
    ensureChar(rawText[1], DIGITS),
    ensureChar(rawText[2], DIGITS),
    ensureChar(rawText[3], DIGITS),
    ensureChar(rawText[4], LETTERS),
    ensureChar(rawText[5], LETTERS),
  ];

  const region = base.region && base.region.trim() ? base.region.trim() : DEFAULT_PLATE_VALUE.region;

  return {
    text: normalizedChars.join(""),
    region,
  };
};

const setCharAt = (text: string, index: number, nextChar: string) => {
  const chars = text.split("");
  chars[index] = nextChar;
  return chars.join("");
};

export default function PlateSelectForm({
  size = "lg",
  responsive = true,
  flagSrc = "/flag-russia.svg",
  showCaption = true,
  className = "",
  value,
  defaultValue,
  onChange,
}: Props) {
  const isControlled = value != null;
  const controlledValue = React.useMemo(() => (value != null ? normalizeValue(value) : null), [value]);
  const [internalValue, setInternalValue] = React.useState<PlateSelectValue>(() => normalizeValue(defaultValue));
  const currentValue = controlledValue ?? internalValue;

  React.useEffect(() => {
    if (!isControlled && defaultValue) {
      setInternalValue(normalizeValue(defaultValue));
    }
  }, [defaultValue, isControlled]);

  const applyChange = React.useCallback(
    (nextRaw: PlateSelectValue) => {
      const next = normalizeValue(nextRaw);
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const preset = PRESETS[size];
  const { ref: wrapperRef, k } = useScale(preset.w);

  const isXs = size === "xs";

  const borderW   = isXs ? 2 : Math.max(1, 8 * k);
  const radius    = isXs ? 10 : Math.max(6, 14 * k);
  const outerPadY = isXs ? 4 : 6 * k;              

  const mainFontLetter  = isXs ? 48 : 140 * k;
  const mainFontNumber  = isXs ? 60 : 180 * k;
  const mainGap         = isXs ? 15 : 20 * k;       
  const mainPx          = isXs ? 6  : 32 * k;     
  const mainPb          = isXs ? 0  : 1;           
  const slotW = isXs ? 22 : 90 * k;               
  const slotH = isXs ? 68 : mainFontNumber;        
  const digitGap  = isXs ? 3 : 4 * k;              
  const digitGapLetter  = isXs ? 7 : 4 * k;              

  const regionFont  = isXs ? 32 : 128 * k;
  const rusFont     = isXs ? 14 : 42 * k;
  const rusRowH     = isXs ? 16 : 40 * k;
  const rusGap      = isXs ? 6  : 10 * k;
  const rusPb       = isXs ? 2  : 4 * k;
  const flagH       = isXs ? 12 : rusRowH * 0.9;
  const flagBorder  = isXs ? 1  : Math.max(1, 2 * k);

  const captionFs = isXs ? 0 : Math.max(10, 24 * k); 
  const captionMt = isXs ? 0 : Math.max(4, 8 * k);

  const containerStyle: React.CSSProperties = responsive && !isXs
    ? { width: "100%", maxWidth: `${preset.w}px` }
    : { width: `${preset.w}px` };

  const glyphColor = (v: string) => (v === "*" ? "#9AA0A6" : "#000000");

  const text = currentValue.text;
  const firstLetter = text[0] ?? "*";
  const firstDigit = text[1] ?? "*";
  const secondDigit = text[2] ?? "*";
  const thirdDigit = text[3] ?? "*";
  const secondLetter = text[4] ?? "*";
  const thirdLetter = text[5] ?? "*";
  const region = currentValue.region ?? "*";

  const handleFirstLetterChange = (v: string) =>
    applyChange({ text: setCharAt(text, 0, v), region });
  const handleFirstDigitChange = (v: string) =>
    applyChange({ text: setCharAt(text, 1, v), region });
  const handleSecondDigitChange = (v: string) =>
    applyChange({ text: setCharAt(text, 2, v), region });
  const handleThirdDigitChange = (v: string) =>
    applyChange({ text: setCharAt(text, 3, v), region });
  const handleSecondLetterChange = (v: string) =>
    applyChange({ text: setCharAt(text, 4, v), region });
  const handleThirdLetterChange = (v: string) =>
    applyChange({ text: setCharAt(text, 5, v), region });
  const handleRegionChange = (v: string) =>
    applyChange({ text, region: v });

  return (
    <figure className={`flex flex-col ${className} text-black`} style={containerStyle}>
      <div ref={wrapperRef} className="w-full">
        <div
          className="flex flex-col rounded-xl bg-black box-border"
          style={{ border: `${borderW}px solid #000`, borderRadius: radius, height: `${preset.h}px` }}
        >
          <div className="flex w-full bg-black rounded-xl font-road" style={{ height: "100%" }}>
            <div
              className="flex items-end justify-center bg-white font-bold"
              style={{
                width: "70%",
                border: `${borderW}px solid #000`,
                borderRadius: radius,
                paddingLeft: mainPx,
                paddingRight: mainPx,
                paddingBottom: mainPb,
                paddingTop: isXs ? 2 : undefined,
                gap: mainGap,
                boxSizing: "border-box",
              }}
            >
              {/* A */}
              <SlotSelect
                ariaLabel="Буква 1"
                value={firstLetter}
                onChange={handleFirstLetterChange}
                options={LETTERS as unknown as string[]}
                fontSize={mainFontLetter}
                slotW={slotW}
                slotH={slotH}
                color={glyphColor(firstLetter)}
                dropdownMaxHeight={240}
              />

              {/* DDD */}
              <div className="flex" style={{ gap: digitGap }}>
                <SlotSelect
                  ariaLabel="Цифра 1"
                  value={firstDigit}
                  onChange={handleFirstDigitChange}
                  options={DIGITS as unknown as string[]}
                  fontSize={mainFontNumber}
                  slotW={slotW}
                  slotH={slotH}
                  color={glyphColor(firstDigit)}
                  dropdownMaxHeight={280}
                />
                <SlotSelect
                  ariaLabel="Цифра 2"
                  value={secondDigit}
                  onChange={handleSecondDigitChange}
                  options={DIGITS as unknown as string[]}
                  fontSize={mainFontNumber}
                  slotW={slotW}
                  slotH={slotH}
                  color={glyphColor(secondDigit)}
                  dropdownMaxHeight={280}
                />
                <SlotSelect
                  ariaLabel="Цифра 3"
                  value={thirdDigit}
                  onChange={handleThirdDigitChange}
                  options={DIGITS as unknown as string[]}
                  fontSize={mainFontNumber}
                  slotW={slotW}
                  slotH={slotH}
                  color={glyphColor(thirdDigit)}
                  dropdownMaxHeight={280}
                />
              </div>

              {/* AA */}
              <div className="flex" style={{ gap: digitGapLetter }}>
                <SlotSelect
                  ariaLabel="Буква 2"
                  value={secondLetter}
                  onChange={handleSecondLetterChange}
                  options={LETTERS as unknown as string[]}
                  fontSize={mainFontLetter}
                  slotW={slotW}
                  slotH={slotH}
                  color={glyphColor(secondLetter)}
                  dropdownMaxHeight={240}
                />
                <SlotSelect
                  ariaLabel="Буква 3"
                  value={thirdLetter}
                  onChange={handleThirdLetterChange}
                  options={LETTERS as unknown as string[]}
                  fontSize={mainFontLetter}
                  slotW={slotW}
                  slotH={slotH}
                  color={glyphColor(thirdLetter)}
                  dropdownMaxHeight={240}
                />
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
                gap: (isXs ? 10 : 4 * k),
                boxSizing: "border-box",
              }}
            >
              <SlotSelect
                ariaLabel="Регион (РФ)"
                value={region}
                onChange={handleRegionChange}
                options={REGIONS_RF as unknown as string[]}
                fontSize={regionFont}
                slotW={isXs ? 38 : Math.max(110 * k, 130 * 1.35)}
                slotH={isXs ? 22 : regionFont * 1.05}
                color={glyphColor(region)}
                centerText
                dropdownMaxHeight={240}
              />

              <p className="flex items-center justify-center m-0" style={{ height: rusRowH, gap: rusGap, paddingBottom: rusPb}}>
                <span className="font-extrabold font-actay-druk" style={{ fontSize: rusFont, lineHeight: 1 }}>
                  RUS
                </span>
                <img src={flagSrc} alt="Russia" style={{ height: flagH, border: `${flagBorder}px solid #000`, display: "block" }} />
              </p>
            </div>
          </div>

          {showCaption && !isXs && (
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

// --------------------------------------------------------------
