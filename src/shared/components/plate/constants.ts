import { PLATE_LETTERS } from "@/shared/lib/plateLetters"

export const LETTERS = [
  ...PLATE_LETTERS,
  "*",
] as const;

export const DIGITS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "*",
] as const;

export type PlateSize = "lg" | "xs";

export const PRESETS: Record<PlateSize, { w: number; h: number }> = {
  lg: { w: 879, h: 180 },
  xs: { w: 320, h: 70 },
};
