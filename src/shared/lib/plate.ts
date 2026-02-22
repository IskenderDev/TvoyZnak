import type { NumberItem, PlateInfo } from "@/entities/number/types";
import { formatPrice } from "./format";
import { normalizePlateLetter } from "./plateLetters";

type PlatePartsLike = {
  firstLetter?: string | null;
  firstDigit?: string | null;
  secondDigit?: string | null;
  thirdDigit?: string | null;
  secondLetter?: string | null;
  thirdLetter?: string | null;
  fullCarNumber?: string | null;
  fullNumber?: string | null;
};

const sanitizeLetter = (value?: string): string => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed === "*") return "";
  return normalizePlateLetter(trimmed);
};

const sanitizeDigit = (value?: string): string => {
  if (typeof value !== "string") return "";
  const match = value.match(/[0-9]/);
  return match ? match[0] : "";
};

export const formatRegionCode = (value?: string | number | null): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    const int = Math.trunc(value);
    const absolute = Math.abs(int);
    const stringValue = absolute.toString();
    const padded = stringValue.padStart(Math.max(2, stringValue.length), "0");
    return int < 0 ? `-${padded}` : padded;
  }

  if (typeof value === "string") {
    const cleaned = value.trim();
    if (!cleaned) {
      return "";
    }

    if (/^-?\d+$/.test(cleaned)) {
      const isNegative = cleaned.startsWith("-");
      const numericPart = isNegative ? cleaned.slice(1) : cleaned;
      const padded = numericPart.padStart(Math.max(2, numericPart.length), "0");
      return isNegative ? `-${padded}` : padded;
    }

    return cleaned;
  }

  return "";
};

const sanitizeRegion = (value?: string | number): string => {
  return formatRegionCode(value ?? "");
};

const buildSeriesFromPlate = (plate?: PlateInfo | null): string => {
  if (!plate) return "";

  const letters = [
    sanitizeLetter(plate.firstLetter),
    sanitizeLetter(plate.secondLetter),
    sanitizeLetter(plate.thirdLetter),
  ];
  const digits = [
    sanitizeDigit(plate.firstDigit),
    sanitizeDigit(plate.secondDigit),
    sanitizeDigit(plate.thirdDigit),
  ];

  if (!letters[0] && !digits.some(Boolean)) {
    return "";
  }

  return [letters[0], digits.join(""), letters[1], letters[2]].join("");
};

export const buildCarNumberFromParts = (plate: PlatePartsLike): string => {
  const firstLetter = sanitizeLetter(plate.firstLetter ?? undefined);
  const firstDigit = sanitizeDigit(plate.firstDigit ?? undefined);
  const secondDigit = sanitizeDigit(plate.secondDigit ?? undefined);
  const thirdDigit = sanitizeDigit(plate.thirdDigit ?? undefined);
  const secondLetter = sanitizeLetter(plate.secondLetter ?? undefined);
  const thirdLetter = sanitizeLetter(plate.thirdLetter ?? undefined);

  if (!firstLetter || !firstDigit || !secondDigit || !thirdDigit || !secondLetter || !thirdLetter) {
    return (plate.fullCarNumber ?? plate.fullNumber ?? "").trim();
  }

  return `${firstLetter}${firstDigit}${secondDigit}${thirdDigit}${secondLetter}${thirdLetter}`;
};

export const formatPlateLabel = (
  item: Pick<NumberItem, "series" | "plate" | "region"> | {
    series?: string;
    plate?: PlateInfo | null;
    region?: string | number | null;
  },
): string => {
  const series = typeof item.series === "string" && item.series.trim()
    ? item.series.trim()
    : buildSeriesFromPlate(item.plate ?? null);

  const region = sanitizeRegion(item.region ?? item.plate?.regionId);

  return [series, region].filter(Boolean).join(" ");
};

export const buildContactPrefill = (item: Pick<NumberItem, "series" | "plate" | "region" | "originalPrice" | "markupPrice">) => {
  const numberLabel = formatPlateLabel(item);
  const displayPrice = item.markupPrice ?? item.originalPrice
  const priceLabel = typeof displayPrice === "number" && displayPrice > 0 ? formatPrice(displayPrice) : "";
  const descriptionParts = [numberLabel, priceLabel].filter(Boolean);

  return {
    carNumber: descriptionParts.join(" — "),
    feedbackType: "buy" as const,
  };
};
