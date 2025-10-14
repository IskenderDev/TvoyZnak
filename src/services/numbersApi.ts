import type { NumberItem } from "@/entities/number/types";

/**
 * Сигнатуры методов для ресурса "Номера". Без реализации.
 */

export interface NumbersListParams {
  // Будущие параметры (страница, фильтры, сортировки) — не реализуем
}

export interface NumbersApi {
  list(params?: NumbersListParams): Promise<NumberItem[]>;
  get(id: string): Promise<NumberItem>;
  create(payload: Omit<NumberItem, "id" | "date" | "status">): Promise<NumberItem>;
  update(id: string, payload: Partial<Omit<NumberItem, "id">>): Promise<NumberItem>;
  delete(id: string): Promise<void>;
}

// export const numbersApi: NumbersApi = {} as any;
