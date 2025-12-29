export type PlateCategoryId =
  | "same-digits"
  | "same-letters"
  | "first-ten"
  | "round-hundreds"
  | "mirror";

export const PLATE_CATEGORIES: PlateCategoryId[] = [
  "same-digits",
  "same-letters",
  "first-ten",
  "round-hundreds",
  "mirror",
];

export const CATEGORY_LABELS: Record<PlateCategoryId, string> = {
  "same-digits": "Одинаковые цифры",
  "same-letters": "Одинаковые буквы",
  "first-ten": "Первая десятка",
  "round-hundreds": "Ровные",
  mirror: "Зеркальные",
};

const MIRROR_NUMBERS: Set<string> = (() => {
  const values = new Set<string>();
  for (let first = 0; first <= 9; first += 1) {
    for (let middle = 0; middle <= 9; middle += 1) {
      values.add(`${first}${middle}${first}`);
    }
  }
  return values;
})();

const normalizeDigits = (digits: string): string => digits.replace(/[^0-9]/g, "");
const normalizeLetters = (letters: string): string => letters.replace(/[^A-Za-zА-Яа-яЁё]/gu, "");

export const deriveCategories = (digits: string, letters: string): PlateCategoryId[] => {
  const normalizedDigits = normalizeDigits(digits);
  const normalizedLetters = normalizeLetters(letters).toUpperCase();
  const categories = new Set<PlateCategoryId>();

  if (normalizedDigits.length === 3) {
    const [d1, d2, d3] = normalizedDigits;

    if (d1 === d2 && d2 === d3) {
      categories.add("same-digits");
    }

    if (/^00[1-9]$/.test(normalizedDigits)) {
      categories.add("first-ten");
    }

    if (/^[1-9]00$/.test(normalizedDigits)) {
      categories.add("round-hundreds");
    }

    if (MIRROR_NUMBERS.has(normalizedDigits)) {
      categories.add("mirror");
    }
  }

  if (normalizedLetters.length >= 3) {
    const lettersTriple = normalizedLetters.slice(0, 3);
    const [l1, l2, l3] = lettersTriple;
    if (l1 === l2 && l2 === l3) {
      categories.add("same-letters");
    }
  }

  return Array.from(categories);
};
