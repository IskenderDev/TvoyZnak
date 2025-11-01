import { useCallback, useState } from "react";
import { apiService } from "@/shared/api/apiService";
import type { CarNumberLot } from "@/entities/car-number-lot/types";
import type { User } from "@/entities/user/types";
import type { Post } from "@/entities/post/types";

interface UseAdminState {
  lots: CarNumberLot[];
  users: User[];
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export const useAdmin = () => {
  const [state, setState] = useState<UseAdminState>({
    lots: [],
    users: [],
    posts: [],
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const loadLots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const lots = await apiService.admin.carNumberLots.list();
      setState((prev) => ({ ...prev, lots }));
      return lots;
    } catch (error) {
      const message = extractErrorMessage(error, "Не удалось загрузить объявления");
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  const getLot = useCallback(async (id: string) => {
    const lot = await apiService.admin.carNumberLots.get(id);
    setState((prev) => ({
      ...prev,
      lots: prev.lots.some((current) => current.id === lot.id)
        ? prev.lots.map((current) => (current.id === lot.id ? lot : current))
        : [...prev.lots, lot],
    }));
    return lot;
  }, []);

  const confirmLot = useCallback(async (id: string) => {
    const lot = await apiService.admin.carNumberLots.confirm(id);
    setState((prev) => ({
      ...prev,
      lots: prev.lots.map((current) => (current.id === lot.id ? lot : current)),
    }));
    return lot;
  }, []);

  const updateLot = useCallback(
    async (id: string, payload: { price?: number; status?: string; description?: string }) => {
      const lot = await apiService.admin.carNumberLots.update(id, payload);
      setState((prev) => ({
        ...prev,
        lots: prev.lots.map((current) => (current.id === lot.id ? lot : current)),
      }));
      return lot;
    },
    [],
  );

  const removeLot = useCallback(async (id: string) => {
    await apiService.admin.carNumberLots.remove(id);
    setState((prev) => ({
      ...prev,
      lots: prev.lots.filter((lot) => lot.id !== id),
    }));
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await apiService.admin.users.list();
      setState((prev) => ({ ...prev, users }));
      return users;
    } catch (error) {
      const message = extractErrorMessage(error, "Не удалось загрузить пользователей");
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  const updateUser = useCallback(async (id: string, payload: Partial<User>) => {
    const user = await apiService.admin.users.update(id, payload);
    setState((prev) => ({
      ...prev,
      users: prev.users.map((current) => (current.id === user.id ? user : current)),
    }));
    return user;
  }, []);

  const removeUser = useCallback(async (id: string) => {
    await apiService.admin.users.remove(id);
    setState((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.id !== id),
    }));
  }, []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const posts = await apiService.admin.posts.list();
      setState((prev) => ({ ...prev, posts }));
      return posts;
    } catch (error) {
      const message = extractErrorMessage(error, "Не удалось загрузить публикации");
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  const getPost = useCallback(async (id: string) => {
    const post = await apiService.admin.posts.get(id);
    setState((prev) => ({
      ...prev,
      posts: prev.posts.some((item) => item.id === post.id)
        ? prev.posts.map((item) => (item.id === post.id ? post : item))
        : [...prev.posts, post],
    }));
    return post;
  }, []);

  const createPost = useCallback(async (payload: Partial<Post>) => {
    const post = await apiService.admin.posts.create(payload);
    setState((prev) => ({
      ...prev,
      posts: [post, ...prev.posts.filter((item) => item.id !== post.id)],
    }));
    return post;
  }, []);

  const updatePost = useCallback(async (id: string, payload: Partial<Post>) => {
    const post = await apiService.admin.posts.update(id, payload);
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((item) => (item.id === post.id ? post : item)),
    }));
    return post;
  }, []);

  const removePost = useCallback(async (id: string) => {
    await apiService.admin.posts.remove(id);
    setState((prev) => ({
      ...prev,
      posts: prev.posts.filter((item) => item.id !== id),
    }));
  }, []);

  return {
    lots: state.lots,
    users: state.users,
    posts: state.posts,
    loading: state.loading,
    error: state.error,
    loadLots,
    getLot,
    confirmLot,
    updateLot,
    removeLot,
    loadUsers,
    updateUser,
    removeUser,
    loadPosts,
    getPost,
    createPost,
    updatePost,
    removePost,
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
