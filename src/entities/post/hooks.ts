import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createPost,
  deletePost,
  getPost,
  listPosts,
  updatePost,
} from "./api";
import type {
  Paginated,
  Post,
  PostCreatePayload,
  PostUpdatePayload,
  PostsListParams,
} from "./types";

export const postsKeys = {
  all: ["posts"] as const,
  lists: () => [...postsKeys.all, "list"] as const,
  list: (params: PostsListParams | undefined) =>
    [...postsKeys.lists(), params ?? {}] as const,
  details: () => [...postsKeys.all, "detail"] as const,
  detail: (postId: string) => [...postsKeys.details(), postId] as const,
};

export const usePostsQuery = (params: PostsListParams) =>
  useQuery({
    queryKey: postsKeys.list(params),
    queryFn: () => listPosts(params),
    placeholderData: keepPreviousData,
  });

export const usePostQuery = (postId: string, enabled = true) =>
  useQuery({
    queryKey: postsKeys.detail(postId),
    queryFn: () => getPost(postId),
    enabled,
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PostCreatePayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error, "Не удалось создать пост");
      toast.error(message);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PostUpdatePayload) => updatePost(payload),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postsKeys.detail(post.id) });
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error, "Не удалось обновить пост");
      toast.error(message);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postsKeys.lists() });
      const previous = queryClient.getQueriesData<Paginated<Post>>({
        queryKey: postsKeys.lists(),
      });

      previous.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<Paginated<Post>>(key, {
          ...data,
          items: data.items.filter((item) => item.id !== postId),
          total: Math.max(0, data.total - 1),
        });
      });

      return { previous };
    },
    onError: (error: unknown, _postId, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      const message = extractErrorMessage(error, "Не удалось удалить пост");
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Пост удалён");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
    },
  });
};

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const maybe = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown } };
    };

    const responseMessage = maybe.response?.data?.message;
    const responseError = maybe.response?.data?.error;
    const message = maybe.message;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    if (typeof responseError === "string" && responseError.trim()) {
      return responseError;
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
};
