import { useCallback, useMemo, useState } from "react";

import { apiService } from "@/shared/api/apiService";
import type {
  CarNumberLot,
  CarNumberLotFilters,
  CarNumberLotPayload,
  PaginatedResponse,
} from "@/shared/types";

interface LotsState {
  items: CarNumberLot[];
  total: number;
  page: number;
  limit: number;
}

const initialState: LotsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
};

export function useCarNumberLots() {
  const [state, setState] = useState<LotsState>(initialState);
  const [current, setCurrent] = useState<CarNumberLot | null>(null);
  const [loading, setLoading] = useState(false);

  const updateStateFromResponse = useCallback((response: PaginatedResponse<CarNumberLot>) => {
    setState({
      items: response.data,
      total: response.total,
      page: response.page,
      limit: response.limit,
    });
  }, []);

  const fetchLots = useCallback(
    async (params?: { page?: number; limit?: number } & CarNumberLotFilters) => {
      setLoading(true);
      try {
        const response = await apiService.carNumberLots.list(params);
        updateStateFromResponse(response);
      } finally {
        setLoading(false);
      }
    },
    [updateStateFromResponse],
  );

  const fetchMyLots = useCallback(
    async (params?: { page?: number; limit?: number }) => {
      setLoading(true);
      try {
        const response = await apiService.carNumberLots.listMine(params);
        updateStateFromResponse(response);
      } finally {
        setLoading(false);
      }
    },
    [updateStateFromResponse],
  );

  const getLot = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const lot = await apiService.carNumberLots.getById(id);
      setCurrent(lot);
      return lot;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLot = useCallback(async (payload: CarNumberLotPayload) => {
    setLoading(true);
    try {
      const lot = await apiService.carNumberLots.create(payload);
      return lot;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLot = useCallback(async (id: string, payload: CarNumberLotPayload) => {
    setLoading(true);
    try {
      const lot = await apiService.carNumberLots.update(id, payload);
      setCurrent(lot);
      return lot;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLot = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await apiService.carNumberLots.remove(id);
      setState((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
        total: Math.max(prev.total - 1, 0),
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      ...state,
      current,
      loading,
      fetchLots,
      fetchMyLots,
      getLot,
      createLot,
      updateLot,
      deleteLot,
    }),
    [createLot, current, deleteLot, fetchLots, fetchMyLots, getLot, loading, state, updateLot],
  );
}
