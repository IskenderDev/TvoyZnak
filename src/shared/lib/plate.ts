import type { CarNumberLot, CarNumberPlate } from "@/entities/car-number-lot/types";
import { formatPrice } from "./format";

const sanitizeLetter = (value?: string): string => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed === "*") return "";
  return trimmed.slice(0, 1).toUpperCase();
};

const sanitizeDigit = (value?: string): string => {
  if (typeof value !== "string") return "";
  const match = value.match(/[0-9]/);
  return match ? match[0] : "";
};

const sanitizeRegion = (value?: string | number): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toString();
  }

  if (typeof value === "string") {
    const cleaned = value.trim();
    return cleaned;
  }

  return "";
};

const buildSeriesFromPlate = (plate?: CarNumberPlate | null): string => {
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

export const formatPlateLabel = (
  item: Pick<CarNumberLot, "series" | "plate" | "region"> | {
    series?: string;
    plate?: CarNumberPlate | null;
    region?: string | number | null;
  },
): string => {
  const series = typeof item.series === "string" && item.series.trim()
    ? item.series.trim()
    : buildSeriesFromPlate(item.plate ?? null);

  const region = sanitizeRegion(item.region ?? item.plate?.regionId);

  return [series, region].filter(Boolean).join(" ");
};

export const buildContactPrefill = (
  item: Pick<CarNumberLot, "series" | "plate" | "region" | "price" | "seller">,
) => {
  const numberLabel = formatPlateLabel(item);
  const priceLabel = typeof item.price === "number" && item.price > 0 ? formatPrice(item.price) : "";
  const descriptionParts = [numberLabel, priceLabel, item.seller].filter(Boolean);

  return {
    carNumber: descriptionParts.join(" — "),
    feedbackType: "buy" as const,
  };
};
