import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  type PostCreateDto,
  type PostUpdateDto,
  type PostResponseDto,
} from "../../types";
import { api } from "../../lib/api";

export function usePostFindOne(id: number) {
  return useQuery({
    queryKey: ["post", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api(`/post/${id}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch post");
      }
      return res.json() as Promise<PostResponseDto>;
    },
    retry: 0,
  });
}

export function usePostFindByUserId(userId: number) {
  return useQuery({
    queryKey: ["posts_user", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await api(`/post/posts/${userId}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch posts");
      }
      return res.json() as Promise<PostResponseDto[]>;
    },
    retry: 0,
  });
}

export function usePostCreate() {
  const qc = useQueryClient();
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
      qc.invalidateQueries({ queryKey: ["posts_user", post.creatorId] });
    },
    onError: (err: Error) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function usePostUpdate(postId: number, userId: number) {
  const qc = useQueryClient();
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
      qc.invalidateQueries({ queryKey: ["posts_user", userId] });
      qc.invalidateQueries({ queryKey: ["post_detail", postId] });
    },
    onError: (err: Error) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function usePostDelete(postId: number, userId: number) {
  const qc = useQueryClient();
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
      qc.invalidateQueries({ queryKey: ["posts_user", userId] });
      qc.invalidateQueries({ queryKey: ["post_detail", postId] });
    },
    onError: (err: Error) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
