import { useCallback, useState } from "react";
import { apiService } from "@/shared/api/apiService";
import type {
  CarNumberLotsListParams,
  CreateCarNumberLotAndRegisterPayload,
  CreateCarNumberLotPayload,
  UpdateCarNumberLotPayload,
} from "@/shared/services/carNumberLotsApi";
import type { CarNumberLot } from "@/entities/car-number-lot/types";

interface UseCarNumberLotsState {
  items: CarNumberLot[];
  loading: boolean;
  error: string | null;
}

export const useCarNumberLots = () => {
  const [state, setState] = useState<UseCarNumberLotsState>({ items: [], loading: false, error: null });

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const setItems = useCallback((items: CarNumberLot[]) => {
    setState((prev) => ({ ...prev, items }));
  }, []);

  const loadAll = useCallback(async (params?: CarNumberLotsListParams) => {
    setLoading(true);
    setError(null);
    try {
      const items = await apiService.carNumberLots.list(params);
      setItems(items);
      return items;
    } catch (error) {
      const message = extractErrorMessage(error, "Не удалось загрузить объявления");
      setError(message);
      setItems([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setError, setItems, setLoading]);

  const loadMy = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await apiService.carNumberLots.listMy();
      setItems(items);
      return items;
    } catch (error) {
      const message = extractErrorMessage(error, "Не удалось загрузить мои объявления");
      setError(message);
      setItems([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setError, setItems, setLoading]);

  const getOne = useCallback(async (id: string) => {
    return apiService.carNumberLots.get(id);
  }, []);

  const create = useCallback(async (payload: CreateCarNumberLotPayload) => {
    return apiService.carNumberLots.create(payload);
  }, []);

  const createAndRegister = useCallback(async (payload: CreateCarNumberLotAndRegisterPayload) => {
    return apiService.carNumberLots.createAndRegister(payload);
  }, []);

  const update = useCallback(async (id: string, payload: UpdateCarNumberLotPayload) => {
    return apiService.carNumberLots.update(id, payload);
  }, []);

  const remove = useCallback(async (id: string) => {
    await apiService.carNumberLots.delete(id);
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    loadAll,
    loadMy,
    getOne,
    create,
    createAndRegister,
    update,
    remove,
  };
};

function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const record = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown } | unknown };
    };

    const responseData = record.response?.data;
    if (responseData && typeof responseData === "object") {
      const dataRecord = responseData as { message?: unknown; error?: unknown };
      const message = dataRecord.message ?? dataRecord.error;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }

  return fallback;
}
