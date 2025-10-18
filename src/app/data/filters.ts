export const REGION_OPTS = [
  { label: "25", value: "25" },
  { label: "77", value: "77" },
  { label: "78", value: "78" },
  { label: "97", value: "97" },
  { label: "799", value: "799" },
] satisfies { label: string; value: string }[]

export const CATEGORY_OPTS = [
  { label: "Одинаковые цифры", value: "same-digits" },
  { label: "Одинаковые буквы", value: "same-letters" },
  { label: "Зеркальные", value: "mirror" },
  { label: "VIP", value: "vip" },
  { label: "Случайные", value: "random" },
] satisfies { label: string; value: string }[]
