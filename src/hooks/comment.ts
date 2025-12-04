import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { api } from "../lib/api";
import type { CommentCreateDto, CommentResponseDto } from "../types";

export function useCommentFindByPost(postId: number) {
  return useQuery({
    queryKey: ["comments", postId],
    enabled: !!postId,
    queryFn: async () => {
      const res = await api(`/comment/${postId}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch comments");
      }
      return res.json() as Promise<CommentResponseDto[]>;
    },
  });
}

export function useCommentCreate() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: CommentCreateDto) => {
      const res = await api("/comment", {
        method: "POST",
        body: JSON.stringify(dto),
      });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to create comment");
      }
      return res.json() as Promise<CommentResponseDto>;
    },
    onSuccess: (data) => {
        console.log(data)
      enqueueSnackbar("Comment created!", { variant: "success" });
      qc.invalidateQueries({ queryKey: ["comments", data.postId] });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useCommentUpdate() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const res = await api(`/comment/${id}?content=${encodeURIComponent(content)}`, {
        method: "PATCH",
      });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to update comment");
      }
      return res.json() as Promise<CommentResponseDto>;
    },
    onSuccess: (data) => {
      enqueueSnackbar("Comment updated!", { variant: "success" });
      qc.invalidateQueries({ queryKey: ["comments", data.postId] });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useCommentDelete() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api(`/comment/${id}`, { method: "DELETE" });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to delete comment");
      }
      return res.json() as Promise<CommentResponseDto>;
    },
    onSuccess: (data) => {
      enqueueSnackbar("Comment deleted!", { variant: "success" });
      qc.invalidateQueries({ queryKey: ["comments", data.postId] });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
