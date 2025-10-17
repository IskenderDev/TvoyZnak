export type PlateLetter = string;
export type PlateDigit = string;

export interface PlateView {
  price: number;
  comment: string;
  firstLetter: PlateLetter;
  secondLetter: PlateLetter;
  thirdLetter: PlateLetter;
  firstDigit: PlateDigit;
  secondDigit: PlateDigit;
  thirdDigit: PlateDigit;
  regionId: number;
}

export type PlateCategory =
  | "same-digits"
  | "same-letters"
  | "mirror"
  | "vip"
  | "random";

export interface PlateRow {
  id: string;
  date: string;
  seller: string;
  price: number;
  region: string;
  category: PlateCategory;
  plate: {
    firstLetter: PlateLetter;
    firstDigit: PlateDigit;
    secondDigit: PlateDigit;
    thirdDigit: PlateDigit;
    secondLetter: PlateLetter;
    thirdLetter: PlateLetter;
    regionId: number;
    comment?: string;
    price?: number;
  };
}

export interface PlateFilterOption {
  label: string;
  value: string;
}
