import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { LikeCreateDto, LikeResponseDto } from "../types";
import { api } from "../lib/api";

export function useLikeFind(type: string, id: number) {
  return useQuery({
    queryKey: ["likes", type, id],
    enabled: !!type && !!id,
    queryFn: async () => {
      const res = await api(`/like?type=${type}&id=${id}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch likes");
      }

      return res.json() as Promise<LikeResponseDto[]>;
    },
  });
}

export function useLikeCreate() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: LikeCreateDto) => {
      const res = await api(`/like`, {
        method: "POST",
        body: JSON.stringify(dto),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to create like");
      }

      return res.json() as Promise<LikeResponseDto>;
    },
    onSuccess: (data) => {
      enqueueSnackbar("Liked!", { variant: "success" });

      if (data?.postId) {
        qc.invalidateQueries({
          queryKey: ["likes", "post", data.postId],
        });
      }

      if (data?.messageId) {
        qc.invalidateQueries({
          queryKey: ["likes", "message", data.messageId],
        });
      }

      if (data?.commentId) {
        qc.invalidateQueries({
          queryKey: ["likes", "comment", data.commentId],
        });
      }
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useLikeDelete() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api(`/like/${id}`, { method: "DELETE" });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to delete like");
      }

      return res.json() as Promise<LikeResponseDto>;
    },

    onSuccess: (data) => {
      enqueueSnackbar("Like removed", { variant: "success" });

      if (data?.postId) {
        qc.invalidateQueries({
          queryKey: ["likes", "post", data.postId],
        });
      }

      if (data?.messageId) {
        qc.invalidateQueries({
          queryKey: ["likes", "message", data.messageId],
        });
      }

      if (data?.commentId) {
        qc.invalidateQueries({
          queryKey: ["likes", "comment", data.commentId],
        });
      }
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
