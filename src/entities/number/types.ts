export type RegionCode = string; // коды регионов РФ (строка, без проверки)

export interface NumberItem {
  id: string;
  series: string;       // серия/номер (строка)
  region: RegionCode;   // регион РФ (строка/код)
  price: number;        // цена (число)
  seller: string;       // продавец (строка/идентификатор)
  date: string;         // дата добавления (ISO)
  status: "available" | "sold" | "hidden";
}
