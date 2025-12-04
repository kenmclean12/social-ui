import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { Like, LikeCreateDto } from "../types";
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
      return res.json() as Promise<Like[]>;
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

      return res.json() as Promise<Like>;
    },
    onSuccess: (data) => {
      enqueueSnackbar("Liked!", { variant: "success" });
      if (data?.post?.id) {
        const key = ["likes", "post", data.post.id];
        qc.invalidateQueries({ queryKey: key });
        qc.refetchQueries({ queryKey: key });
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
      return res.json() as Promise<Like>;
    },
    onSuccess: (data) => {
      enqueueSnackbar("Like removed", { variant: "success" });
      if (data?.post?.id) {
        const key = ["likes", "post", data.post.id];
        qc.invalidateQueries({ queryKey: key });
        qc.refetchQueries({ queryKey: key });
      }
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
