export type RegionCode = string;

export type NumberStatus = "available" | "sold" | "hidden" | string;

export interface PlateInfo {
  firstLetter: string;
  secondLetter: string;
  thirdLetter: string;
  firstDigit: string;
  secondDigit: string;
  thirdDigit: string;
  regionId: number | null;
  regionCode: RegionCode;
  comment?: string;
}

export interface NumberItem {
  id: string;
  series: string;
  region: RegionCode;
  originalPrice: number;
  markupPrice: number;
  /** @deprecated Use originalPrice/markupPrice instead. */
  price: number;
  seller: string;
  sellerLogin?: string;
  sellerName?: string;
  date: string;
  status: NumberStatus;
  categories: string[];
  phone?: string;
  description?: string;
  plate: PlateInfo;
}
