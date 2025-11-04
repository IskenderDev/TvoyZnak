import React from "react";
import { PRESETS, LETTERS, DIGITS, type PlateSize } from "../../../shared/components/plate/constants";
import { useScale } from "../../../shared/components/plate/useScale";
import SlotSelect from "../../../shared/components/plate/SlotSelect";
import { DEFAULT_PLATE_VALUE, type PlateSelectValue } from "../model/types";
import { regionsApi, type Region } from "@/shared/services/regionsApi";

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

type NormalizedPlateSelectValue = PlateSelectValue;

const ensureChar = (char: string | undefined, allowed: readonly string[]) => {
  if (char && allowed.includes(char)) return char;
  return "*";
};

const normalizeValue = (value?: PlateSelectValue): NormalizedPlateSelectValue => {
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

  const rawRegionCode = typeof base.regionCode === "string" ? base.regionCode : "";
  const regionCode = rawRegionCode.trim().toUpperCase().slice(0, 3);

  const rawRegionId = (base as { regionId?: unknown }).regionId;
  let regionId: number | null = null;
  if (typeof rawRegionId === "number" && Number.isFinite(rawRegionId) && rawRegionId > 0) {
    regionId = rawRegionId;
  } else if (typeof rawRegionId === "string") {
    const parsed = Number(rawRegionId.trim());
    if (Number.isFinite(parsed) && parsed > 0) {
      regionId = parsed;
    }
  }

  return {
    text: normalizedChars.join(""),
    regionCode,
    regionId,
  };
};

const setCharAt = (text: string, index: number, nextChar: string) => {
  const chars = text.split("");
  chars[index] = nextChar;
  return chars.join("");
};

const LETTER_OPTIONS = LETTERS.filter((char) => char !== "*");
const DIGIT_OPTIONS = DIGITS.filter((char) => char !== "*");

const LETTERS_HINT = LETTER_OPTIONS.join(", ");
const DIGITS_HINT = DIGIT_OPTIONS.join(", ");

const sortRegions = (a: Region, b: Region) => {
  const codeA = Number.parseInt(a.regionCode, 10);
  const codeB = Number.parseInt(b.regionCode, 10);

  const hasNumericA = Number.isFinite(codeA);
  const hasNumericB = Number.isFinite(codeB);

  if (hasNumericA && hasNumericB) {
    return (codeA as number) - (codeB as number);
  }

  if (hasNumericA) return -1;
  if (hasNumericB) return 1;

  return a.regionCode.localeCompare(b.regionCode, "ru");
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
  const controlledValue = React.useMemo(
    () => (value != null ? normalizeValue(value) : null),
    [value],
  );
  const [internalValue, setInternalValue] = React.useState<NormalizedPlateSelectValue>(() =>
    normalizeValue(defaultValue),
  );
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

  const borderW = isXs ? 2 : Math.max(1, 8 * k);
  const radius = isXs ? 10 : Math.max(6, 14 * k);
  const outerPadY = isXs ? 4 : 6 * k;

  const mainFontLetter = isXs ? 48 : 140 * k;
  const mainFontNumber = isXs ? 60 : 180 * k;
  const mainGap = isXs ? 15 : 20 * k;
  const mainPx = isXs ? 6 : 32 * k;
  const mainPb = isXs ? 0 : 1;
  const slotW = isXs ? 22 : 90 * k;
  const slotH = isXs ? 68 : mainFontNumber;
  const digitGap = isXs ? 3 : 4 * k;
  const digitGapLetter = isXs ? 7 : 4 * k;

  const regionFont = isXs ? 32 : 110 * k;
  const rusFont = isXs ? 14 : 42 * k;
  const rusRowH = isXs ? 16 : 40 * k;
  const rusGap = isXs ? 6 : 10 * k;
  const rusPb = isXs ? 2 : 4 * k;
  const flagH = isXs ? 12 : rusRowH * 0.9;
  const flagBorder = isXs ? 1 : Math.max(1, 2 * k);

  const regionGap = isXs ? 10 : 4 * k;

  const captionFs = isXs ? 0 : Math.max(10, 24 * k);
  const captionMt = isXs ? 0 : Math.max(4, 8 * k);

  const containerStyle: React.CSSProperties =
    responsive && !isXs ? { width: "100%", maxWidth: `${preset.w}px` } : { width: `${preset.w}px` };

  const [error, setError] = React.useState<string | null>(null);

  const slotRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const registerSlot = React.useCallback(
    (index: number) => (node: HTMLButtonElement | null) => {
      slotRefs.current[index] = node;
    },
    [],
  );

  const focusNextSlot = React.useCallback((index: number) => {
    const next = slotRefs.current[index + 1];
    if (!next) return;
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => next.focus());
    } else {
      next.focus();
    }
  }, []);

  const clearError = React.useCallback(() => setError(null), []);

  React.useEffect(() => {
    slotRefs.current[0]?.focus();
  }, []);

  const [regions, setRegions] = React.useState<Region[]>([]);
  const [regionsLoading, setRegionsLoading] = React.useState(false);
  const [regionsError, setRegionsError] = React.useState<string | null>(null);

  const fetchRegions = React.useCallback(async () => {
    setRegionsLoading(true);
    setRegionsError(null);
    try {
      const data = await regionsApi.list();
      const sorted = [...data].sort(sortRegions);
      setRegions(sorted);
      setError((prev) =>
        prev && prev.startsWith("Не удалось загрузить регионы") ? null : prev,
      );
    } catch {
      const message = "Не удалось загрузить регионы";
      setRegionsError(message);
      setError((prev) => prev ?? `${message}. Повторите попытку.`);
    } finally {
      setRegionsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchRegions();
  }, [fetchRegions]);

  const regionOptions = React.useMemo(
    () =>
      regions.map((region) => ({
        value: region.regionCode,
        label: region.regionCode,
        keywords: region.regionName
          ? [region.regionCode, region.regionName]
          : [region.regionCode],
      })),
    [regions],
  );

  const activeRegion = React.useMemo(() => {
    if (!regions.length) return null;
    if (currentValue.regionId != null) {
      const byId = regions.find((region) => region.id === currentValue.regionId);
      if (byId) return byId;
    }
    if (currentValue.regionCode) {
      return regions.find((region) => region.regionCode === currentValue.regionCode) ?? null;
    }
    return null;
  }, [currentValue.regionCode, currentValue.regionId, regions]);

  const resolvedRegionCode = activeRegion?.regionCode ?? currentValue.regionCode ?? "";
  const resolvedRegionId = activeRegion?.id ?? currentValue.regionId ?? null;

  const text = currentValue.text;
  const firstLetter = text[0] ?? "*";
  const firstDigit = text[1] ?? "*";
  const secondDigit = text[2] ?? "*";
  const thirdDigit = text[3] ?? "*";
  const secondLetter = text[4] ?? "*";
  const thirdLetter = text[5] ?? "*";

  const glyphColor = (v: string) =>
    v && v !== "*" && v !== "—" && v !== "..." ? "#000000" : "#9AA0A6";

  const createCommitHandler = React.useCallback(
    (index: number) => () => {
      clearError();
      focusNextSlot(index);
    },
    [clearError, focusNextSlot],
  );

  const handleInvalidLetter = React.useCallback(
    (query: string) => {
      const normalized = query.trim().toUpperCase();
      if (!normalized) return;
      setError(`Недопустимый символ "${normalized}". Допустимые буквы: ${LETTERS_HINT}.`);
    },
    [],
  );

  const handleInvalidDigit = React.useCallback(
    (query: string) => {
      const normalized = query.trim();
      if (!normalized) return;
      setError(`Недопустимое значение "${normalized}". Допустимые цифры: ${DIGITS_HINT}.`);
    },
    [],
  );

  const handleInvalidRegion = React.useCallback((query: string) => {
    const normalized = query.trim();
    if (!normalized) return;
    setError(`Регион "${normalized}" не найден. Введите код из списка.`);
  }, []);

  const handleFirstLetterChange = (next: string) => {
    clearError();
    applyChange({ text: setCharAt(text, 0, next), regionCode: resolvedRegionCode, regionId: resolvedRegionId });
  };
  const handleFirstDigitChange = (next: string) => {
    clearError();
    applyChange({ text: setCharAt(text, 1, next), regionCode: resolvedRegionCode, regionId: resolvedRegionId });
  };
  const handleSecondDigitChange = (next: string) => {
    clearError();
    applyChange({ text: setCharAt(text, 2, next), regionCode: resolvedRegionCode, regionId: resolvedRegionId });
  };
  const handleThirdDigitChange = (next: string) => {
    clearError();
    applyChange({ text: setCharAt(text, 3, next), regionCode: resolvedRegionCode, regionId: resolvedRegionId });
  };
  const handleSecondLetterChange = (next: string) => {
    clearError();
    applyChange({ text: setCharAt(text, 4, next), regionCode: resolvedRegionCode, regionId: resolvedRegionId });
  };
  const handleThirdLetterChange = (next: string) => {
    clearError();
    applyChange({ text: setCharAt(text, 5, next), regionCode: resolvedRegionCode, regionId: resolvedRegionId });
  };
  const handleRegionChange = (code: string) => {
    clearError();
    const match = regions.find((region) => region.regionCode === code);
    applyChange({
      text,
      regionCode: match?.regionCode ?? code,
      regionId: match?.id ?? null,
    });
  };

  const regionDisplayValue = resolvedRegionCode || (regionsLoading ? "..." : "");

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
              <SlotSelect
                ref={registerSlot(0)}
                ariaLabel="Буква 1"
                value={firstLetter}
                onChange={handleFirstLetterChange}
                options={LETTER_OPTIONS as unknown as string[]}
                fontSize={mainFontLetter}
                slotW={slotW}
                slotH={slotH}
                color={glyphColor(firstLetter)}
                dropdownMaxHeight={240}
                onCommit={createCommitHandler(0)}
                onInvalidKey={handleInvalidLetter}
                searchable={false}
              />

              <div className="flex" style={{ gap: digitGap }}>
                <SlotSelect
                  ref={registerSlot(1)}
                  ariaLabel="Цифра 1"
                  value={firstDigit}
                  onChange={handleFirstDigitChange}
                  options={DIGIT_OPTIONS as unknown as string[]}
                  fontSize={mainFontNumber}
                  slotW={slotW}
                  slotH={slotH}
                  color={glyphColor(firstDigit)}
                  dropdownMaxHeight={280}
                  onCommit={createCommitHandler(1)}
                  onInvalidKey={handleInvalidDigit}
                  searchable={false}
                />
                <SlotSelect
                  ref={registerSlot(2)}
                  ariaLabel="Цифра 2"
                  value={secondDigit}
                  onChange={handleSecondDigitChange}
                  options={DIGIT_OPTIONS as unknown as string[]}
                  fontSize={mainFontNumber}
                  slotW={slotW}
                  slotH={slotH}
                  color={glyphColor(secondDigit)}
                  dropdownMaxHeight={280}
                  onCommit={createCommitHandler(2)}
                  onInvalidKey={handleInvalidDigit}
                  searchable={false}
                />
                <SlotSelect
                  ref={registerSlot(3)}
                  ariaLabel="Цифра 3"
                  value={thirdDigit}
                  onChange={handleThirdDigitChange}
                  options={DIGIT_OPTIONS as unknown as string[]}
                  fontSize={mainFontNumber}
                  slotW={slotW}
                  slotH={slotH}
                  color={glyphColor(thirdDigit)}
                  dropdownMaxHeight={280}
                  onCommit={createCommitHandler(3)}
                  onInvalidKey={handleInvalidDigit}
                  searchable={false}
                />
              </div>

              <div className="flex" style={{ gap: digitGapLetter }}>
                <SlotSelect
                  ref={registerSlot(4)}
                  ariaLabel="Буква 2"
                  value={secondLetter}
                  onChange={handleSecondLetterChange}
                  options={LETTER_OPTIONS as unknown as string[]}
                  fontSize={mainFontLetter}
                  slotW={slotW}
                  slotH={slotH}
                  color={glyphColor(secondLetter)}
                  dropdownMaxHeight={240}
                  onCommit={createCommitHandler(4)}
                  onInvalidKey={handleInvalidLetter}
                  searchable={false}
                />
                <SlotSelect
                  ref={registerSlot(5)}
                  ariaLabel="Буква 3"
                  value={thirdLetter}
                  onChange={handleThirdLetterChange}
                  options={LETTER_OPTIONS as unknown as string[]}
                  fontSize={mainFontLetter}
                  slotW={slotW}
                  slotH={slotH}
                  color={glyphColor(thirdLetter)}
                  dropdownMaxHeight={240}
                  onCommit={createCommitHandler(5)}
                  onInvalidKey={handleInvalidLetter}
                  searchable={false}
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
                gap: regionGap,
                boxSizing: "border-box",
              }}
            >
              <SlotSelect
                ref={registerSlot(6)}
                ariaLabel="Регион (РФ)"
                value={resolvedRegionCode}
                displayValue={regionDisplayValue}
                onChange={handleRegionChange}
                options={regionOptions}
                fontSize={regionFont}
                slotW={isXs ? 38 : Math.max(110 * k, 130 * 1.35)}
                slotH={isXs ? 22 : regionFont * 1.05}
                color={glyphColor(regionDisplayValue)}
                centerText
                dropdownMaxHeight={240}
                onCommit={createCommitHandler(6)}
                onInvalidKey={handleInvalidRegion}
                disabled={regionsLoading}
                searchPlaceholder="Код или название"
              />

              <p
                className="flex items-center justify-center m-0"
                style={{ height: rusRowH, gap: rusGap, paddingBottom: rusPb }}
              >
                <span className="font-extrabold font-actay-druk" style={{ fontSize: rusFont, lineHeight: 1 }}>
                  RUS
                </span>
                <img
                  src={flagSrc}
                  alt="Russia"
                  style={{ height: flagH, border: `${flagBorder}px solid #000`, display: "block" }}
                />
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

      {error && (
        <p className="mt-3 text-center text-sm text-[#EB5757] font-semibold" role="alert">
          {error}
        </p>
      )}

      {regionsError && (
        <div className="mt-2 text-center text-xs text-[#EB5757]">
          <span>{regionsError}. </span>
          <button
            type="button"
            onClick={() => void fetchRegions()}
            className="underline decoration-dotted decoration-1 underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[#1E63FF] rounded-sm px-1"
          >
            Повторить загрузку
          </button>
        </div>
      )}
    </figure>
  );
}
