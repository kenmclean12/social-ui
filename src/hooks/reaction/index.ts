import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactionCreateDto, ReactionResponseDto } from "../../types";
import { api } from "../../lib/api";

export function useReactionFind(
  type: "message" | "post" | "comment",
  id: number
) {
  return useQuery({
    queryKey: ["reactions", type, id],
    enabled: !!type && !!id,
    queryFn: async () => {
      const res = await api(`/reaction?type=${type}&id=${id}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch reactions");
      }
      return res.json() as Promise<ReactionResponseDto[]>;
    },
  });
}

export function useReactionCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (dto: ReactionCreateDto) => {
      const res = await api("/reaction", {
        method: "POST",
        body: JSON.stringify(dto),
      });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to create reaction");
      }
      return res.json() as Promise<ReactionResponseDto>;
    },

    onSuccess: (data) => {
      if (data?.postId) {
        qc.invalidateQueries({ queryKey: ["reactions", "post", data.postId] });
        qc.refetchQueries({ queryKey: ["reactions", "post", data.postId] });
      }

      if (data?.messageId) {
        qc.invalidateQueries({
          queryKey: ["reactions", "message", data.messageId],
        });
        qc.refetchQueries({
          queryKey: ["reactions", "message", data.messageId],
        });
      }

      if (data?.commentId) {
        qc.invalidateQueries({
          queryKey: ["reactions", "comment", data.commentId],
        });
        qc.refetchQueries({
          queryKey: ["reactions", "comment", data.commentId],
        });
      }
    },
  });
}

export function useReactionDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api(`/reaction/${id}`, { method: "DELETE" });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to remove reaction");
      }
      return res.json() as Promise<ReactionResponseDto>;
    },

    onSuccess: (data) => {
      if (data?.postId) {
        qc.invalidateQueries({ queryKey: ["reactions", "post", data.postId] });
      }

      if (data?.messageId) {
        qc.invalidateQueries({
          queryKey: ["reactions", "message", data.messageId],
        });
      }

      if (data?.commentId) {
        qc.invalidateQueries({
          queryKey: ["reactions", "comment", data.commentId],
        });
      }
    },
  });
}
