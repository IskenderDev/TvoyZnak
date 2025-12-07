export const PLATE_LETTERS = [
  "А",
  "В",
  "Е",
  "К",
  "М",
  "Н",
  "О",
  "Р",
  "С",
  "Т",
  "У",
  "Х",
] as const;

export const PLATE_LATIN_EQUIVALENTS: Record<(typeof PLATE_LETTERS)[number], string> = {
  А: "A",
  В: "B",
  Е: "E",
  К: "K",
  М: "M",
  Н: "H",
  О: "O",
  Р: "P",
  С: "C",
  Т: "T",
  У: "Y",
  Х: "X",
};

export const normalizePlateLetter = (raw: string): string => {
  if (!raw) return "";
  const upper = raw.trim().slice(0, 1).toUpperCase();

  const fromLatin = Object.entries(PLATE_LATIN_EQUIVALENTS).find(([, latin]) => latin === upper)?.[0];
  const candidate = (fromLatin ?? upper) as (typeof PLATE_LETTERS)[number] | string;

  return PLATE_LETTERS.includes(candidate as (typeof PLATE_LETTERS)[number]) ? candidate : "";
};

export const letterKeywords = (letter: (typeof PLATE_LETTERS)[number]): string[] => {
  const latin = PLATE_LATIN_EQUIVALENTS[letter];
  return latin ? [letter, latin] : [letter];
};
