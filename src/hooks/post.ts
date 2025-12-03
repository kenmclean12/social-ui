import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  type PostCreateDto,
  type PostUpdateDto,
  type PostResponseDto,
} from "../types";
import { api } from "../lib/api";

export const postKeys = {
  all: ["posts"] as const,
  byUser: (userId: number) => ["posts", "user", userId] as const,
  detail: (id: number) => ["posts", id] as const,
};

export function usePostFindByUserId(userId: number) {
  return useQuery({
    queryKey: postKeys.byUser(userId),
    enabled: !!userId,
    queryFn: async () => {
      const res = await api(`/post/posts/${userId}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch posts");
      }
      return res.json() as Promise<PostResponseDto[]>;
    },
  });
}

export function usePostCreate() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: PostCreateDto) => {
      const res = await api("/post", {
        method: "POST",
        body: JSON.stringify(dto),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to create post");
      }

      return res.json() as Promise<PostResponseDto>;
    },
    onSuccess: (post) => {
      enqueueSnackbar("Post created!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: postKeys.byUser(post.creatorId) });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: "error" });
    },
  });
}

export function usePostUpdate(postId: number, userId: number) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: PostUpdateDto) => {
      const res = await api(`/post/${postId}`, {
        method: "PATCH",
        body: JSON.stringify(dto),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to update post");
      }

      return res.json() as Promise<PostResponseDto>;
    },
    onSuccess: () => {
      enqueueSnackbar("Post updated!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: postKeys.byUser(userId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: "error" });
    },
  });
}

export function usePostDelete(postId: number, userId: number) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async () => {
      const res = await api(`/post/${postId}`, {
        method: "DELETE",
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to delete post");
      }

      return res.json() as Promise<PostResponseDto>;
    },
    onSuccess: () => {
      enqueueSnackbar("Post deleted!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: postKeys.byUser(userId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: "error" });
    },
  });
}
