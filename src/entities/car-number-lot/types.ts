export type RegionCode = string;

export type CarNumberLotStatus = "available" | "sold" | "hidden" | "pending" | string;

export interface CarNumberPlate {
  firstLetter: string;
  secondLetter: string;
  thirdLetter: string;
  firstDigit: string;
  secondDigit: string;
  thirdDigit: string;
  regionId: number;
  comment?: string;
  fullCarNumber?: string;
}

export interface CarNumberLotSeller {
  id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
}

export interface CarNumberLot {
  id: string;
  series?: string;
  region?: RegionCode;
  price: number;
  seller: string;
  sellerName?: string;
  sellerLogin?: string;
  sellerInfo?: CarNumberLotSeller;
  status: CarNumberLotStatus;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  phone?: string;
  plate: CarNumberPlate;
}
