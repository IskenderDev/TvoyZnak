import http from "@/shared/api/http";

export interface AdminLotAuthor {
  id?: number | string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface AdminLot {
  id: number;
  fullCarNumber: string;
  firstLetter: string;
  secondLetter: string;
  thirdLetter: string;
  firstDigit: string;
  secondDigit: string;
  thirdDigit: string;
  regionCode: string;
  regionId?: number;
  originalPrice: number;
  markupPrice: number;
  phoneNumber: string;
  originalPhoneNumber: string;
  fullName: string;
  createdDate: string;
  updatedDate?: string;
  comment?: string;
  isConfirm: boolean;
  author?: AdminLotAuthor | null;
}

export interface UpdateAdminLotPayload {
  firstLetter: string;
  secondLetter: string;
  thirdLetter: string;
  firstDigit: string;
  secondDigit: string;
  thirdDigit: string;
  regionId: number;
  markupPrice: number;
  comment?: string | null;
}

export async function fetchAdminLots(signal?: AbortSignal): Promise<AdminLot[]> {
  const response = await http.get<AdminLot[]>("/api/admin/car-number-lots", { signal });
  const data = Array.isArray(response.data) ? response.data : [];
  return data.map((lot) => ({
    ...lot,
    comment: lot.comment ?? "",
    originalPrice: parseNumber(lot.originalPrice),
    markupPrice: parseNumber(lot.markupPrice),
    fullName: lot.fullName?.trim?.() ?? "",
    phoneNumber: lot.phoneNumber?.trim?.() ?? "",
    originalPhoneNumber: lot.originalPhoneNumber?.trim?.() ?? "",
    regionCode: lot.regionCode?.trim?.() ?? "",
  }));
}

const parseNumber = (value: unknown): number => {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : 0;
};

export async function confirmLot(id: number): Promise<void> {
  await http.patch(`/api/admin/car-number-lots/${id}/cofirm`);
}

export async function updateLot(id: number, payload: UpdateAdminLotPayload): Promise<AdminLot> {
  const response = await http.put<AdminLot>(`/api/admin/car-number-lots/${id}`, payload);
  return response.data;
}

export async function deleteLot(id: number): Promise<void> {
  await http.delete(`/api/admin/car-number-lots/${id}`);
}

export const adminLotsApi = {
  fetchAdminLots,
  confirmLot,
  updateLot,
  deleteLot,
};