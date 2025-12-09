import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type {
  CommentCreateDto,
  CommentResponseDto,
  CommentUpdateDto,
} from "../../types";

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
      qc.invalidateQueries({ queryKey: ["comments", data.postId] });
      qc.invalidateQueries({ queryKey: ["posts_user", data.user.id] });
    },
  });
}

export function useCommentUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ content }: CommentUpdateDto) => {
      const res = await api(
        `/comment/${id}?content=${encodeURIComponent(content)}`,
        {
          method: "PATCH",
        }
      );
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to update comment");
      }
      return res.json() as Promise<CommentResponseDto>;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["comments", data.postId] });
    },
  });
}

export function useCommentDelete() {
  const qc = useQueryClient();

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
      qc.invalidateQueries({ queryKey: ["comments", data.postId] });
    },
  });
}
