import { useCallback, useMemo, useState } from "react";

import { apiService } from "@/shared/api/apiService";
import type {
  AdminUpdateCarNumberLotPayload,
  AdminUpdateUserPayload,
  CarNumberLot,
  CarNumberLotFilters,
  PaginatedResponse,
  Post,
  PostPayload,
  User,
} from "@/shared/types";

interface CollectionState<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

const createInitialState = <T,>(): CollectionState<T> => ({
  items: [],
  total: 0,
  page: 1,
  limit: 10,
});

export function useAdmin() {
  const [lotsState, setLotsState] = useState<CollectionState<CarNumberLot>>(
    createInitialState<CarNumberLot>(),
  );
  const [usersState, setUsersState] = useState<CollectionState<User>>(
    createInitialState<User>(),
  );
  const [postsState, setPostsState] = useState<CollectionState<Post>>(
    createInitialState<Post>(),
  );
  const [loading, setLoading] = useState(false);

  const updateState = useCallback(<T,>(
    updater: (response: PaginatedResponse<T>) => void,
    request: () => Promise<PaginatedResponse<T>>,
  ) => {
    setLoading(true);
    return request()
      .then((response) => {
        updater(response);
        return response;
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchAdminLots = useCallback(
    (params?: { page?: number; limit?: number } & CarNumberLotFilters) =>
      updateState<CarNumberLot>(
        (response) =>
          setLotsState({
            items: response.data,
            total: response.total,
            page: response.page,
            limit: response.limit,
          }),
        () => apiService.admin.listCarNumberLots(params),
      ),
    [updateState],
  );

  const fetchUsers = useCallback(
    (params?: { page?: number; limit?: number }) =>
      updateState<User>(
        (response) =>
          setUsersState({
            items: response.data,
            total: response.total,
            page: response.page,
            limit: response.limit,
          }),
        () => apiService.admin.listUsers(params),
      ),
    [updateState],
  );

  const fetchPosts = useCallback(
    (params?: { page?: number; limit?: number }) =>
      updateState<Post>(
        (response) =>
          setPostsState({
            items: response.data,
            total: response.total,
            page: response.page,
            limit: response.limit,
          }),
        () => apiService.admin.listPosts(params),
      ),
    [updateState],
  );

  const confirmLot = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const lot = await apiService.admin.confirmCarNumberLot(id);
      setLotsState((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item.id === id ? lot : item)),
      }));
      return lot;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLot = useCallback(
    async (id: string, payload: AdminUpdateCarNumberLotPayload) => {
      setLoading(true);
      try {
        const lot = await apiService.admin.updateCarNumberLot(id, payload);
        setLotsState((prev) => ({
          ...prev,
          items: prev.items.map((item) => (item.id === id ? lot : item)),
        }));
        return lot;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteLot = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await apiService.admin.deleteCarNumberLot(id);
      setLotsState((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
        total: Math.max(prev.total - 1, 0),
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, payload: AdminUpdateUserPayload) => {
    setLoading(true);
    try {
      const user = await apiService.admin.updateUser(id, payload);
      setUsersState((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item.id === id ? user : item)),
      }));
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await apiService.admin.deleteUser(id);
      setUsersState((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
        total: Math.max(prev.total - 1, 0),
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (payload: PostPayload) => {
    setLoading(true);
    try {
      const post = await apiService.admin.createPost(payload);
      setPostsState((prev) => ({
        ...prev,
        items: [post, ...prev.items],
        total: prev.total + 1,
      }));
      return post;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id: string, payload: PostPayload) => {
    setLoading(true);
    try {
      const post = await apiService.admin.updatePost(id, payload);
      setPostsState((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item.id === id ? post : item)),
      }));
      return post;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await apiService.admin.deletePost(id);
      setPostsState((prev) => ({
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
      lots: lotsState,
      users: usersState,
      posts: postsState,
      loading,
      fetchAdminLots,
      fetchUsers,
      fetchPosts,
      confirmLot,
      updateLot,
      deleteLot,
      updateUser,
      deleteUser,
      createPost,
      updatePost,
      deletePost,
    }),
    [
      confirmLot,
      createPost,
      deleteLot,
      deletePost,
      deleteUser,
      fetchAdminLots,
      fetchPosts,
      fetchUsers,
      loading,
      lotsState,
      postsState,
      updateLot,
      updatePost,
      updateUser,
      usersState,
    ],
  );
}
