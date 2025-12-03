import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { api } from "../lib/api";
import type { FollowDto, SafeFollowDto } from "../types";

export function useFollowGetFollowers(
  userId: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["follow", "followers", userId],
    queryFn: async () => {
      const res = await api(`/follow/${userId}/followers`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch followers");
      }
      return res.json() as Promise<SafeFollowDto[]>;
    },
    ...options,
  });
}

export function useFollowGetFollowing(
  userId: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["follow", "following", userId],
    queryFn: async () => {
      const res = await api(`/follow/${userId}/following`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch following");
      }
      return res.json() as Promise<SafeFollowDto[]>;
    },
    retry: 0,
    ...options,
  });
}

export function useFollowCreate(selfId: number) {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: FollowDto) => {
      const res = await api("/follow/create", {
        method: "POST",
        body: JSON.stringify(dto),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to follow user");
      }

      return res.json() as Promise<SafeFollowDto>;
    },

    onSuccess: (_, dto) => {
      enqueueSnackbar("Followed user!", { variant: "success" });
      qc.invalidateQueries({
        queryKey: ["follow", "following", selfId],
      });
      qc.invalidateQueries({
        queryKey: ["user", dto.followingId],
      });
      qc.invalidateQueries({
        queryKey: ["follow", "followers", dto.followingId],
      });
    },

    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: "error" });
    },
  });
}

export function useFollowRemove(selfId: number) {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (vars: { id: number; followingId: number }) => {
      const { id } = vars;

      const res = await api(`/follow/${id}`, { method: "DELETE" });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to unfollow user");
      }

      return vars;
    },

    onSuccess: ({ followingId }) => {
      enqueueSnackbar("Unfollowed user!", { variant: "success" });

      qc.invalidateQueries({
        queryKey: ["follow", "following", selfId],
      });
      qc.invalidateQueries({
        queryKey: ["user", followingId],
      });
      qc.invalidateQueries({
        queryKey: ["follow", "followers", followingId],
      });
    },

    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: "error" });
    },
  });
}
