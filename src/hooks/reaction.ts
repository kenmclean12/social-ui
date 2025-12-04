import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { ReactionCreateDto, ReactionResponseDto } from "../types";
import { api } from "../lib/api";

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
  const { enqueueSnackbar } = useSnackbar();

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
      enqueueSnackbar("Reaction added!", { variant: "success" });

      const key = data.postId
        ? ["reactions", "post", data.postId]
        : data.messageId
        ? ["reactions", "message", data.messageId]
        : data.commentId
        ? ["reactions", "comment", data.commentId]
        : undefined;

      if (key) {
        qc.invalidateQueries({ queryKey: key });
        qc.refetchQueries({ queryKey: key });
      }
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useReactionDelete() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

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
      enqueueSnackbar("Reaction removed", { variant: "success" });

      const key = data.postId
        ? ["reactions", "post", data.postId]
        : data.messageId
        ? ["reactions", "message", data.messageId]
        : data.commentId
        ? ["reactions", "comment", data.commentId]
        : undefined;

      if (key) {
        qc.invalidateQueries({ queryKey: key });
        qc.refetchQueries({ queryKey: key });
      }
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
