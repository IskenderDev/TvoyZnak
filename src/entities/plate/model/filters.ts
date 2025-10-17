import type { PlateCategory, PlateFilterOption } from "./types";

export const REGION_OPTIONS: PlateFilterOption[] = [
  { label: "Регионы", value: "" },
  { label: "25", value: "25" },
  { label: "77", value: "77" },
  { label: "78", value: "78" },
  { label: "97", value: "97" },
  { label: "799", value: "799" },
];

export const CATEGORY_OPTIONS: PlateFilterOption[] = [
  { label: "Одинаковые цифры", value: "same-digits" },
  { label: "Одинаковые буквы", value: "same-letters" },
  { label: "Зеркальные", value: "mirror" },
  { label: "VIP", value: "vip" },
  { label: "Случайные", value: "random" },
];

export const CATEGORY_ALL_VALUE: "" | PlateCategory = "";
