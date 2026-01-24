import { PLATE_LETTERS } from "@/shared/lib/plateLetters"

export const LETTERS = [
  ...PLATE_LETTERS,
  "*",
] as const;

export const DIGITS = [
  "*",
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
] as const;

export type PlateSize = "lg" | "md" | "xs";

export const PRESETS: Record<PlateSize, { w: number; h: number }> = {
  lg: { w: 879, h: 180 },
  md: { w: 640, h: 140 },
  xs: { w: 320, h: 70 },
};
