import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { api } from "../lib/api";
import type { FollowDto, SafeFollowDto } from "../types";
import { userKeys } from "./user";

export const followKeys = {
  all: ["follow"] as const,
  followers: (id: number) => ["follow", "followers", id] as const,
  following: (id: number) => ["follow", "following", id] as const,
  detail: (id: number) => ["follow", id] as const,
  isFollowing: (followerId: number, followingId: number) =>
    ["follow", "isFollowing", followerId, followingId] as const,
};

export function useFollowGetFollowers(id: number) {
  return useQuery({
    queryKey: followKeys.followers(id),
    enabled: !!id,
    queryFn: async () => {
      const res = await api(`/follow/${id}/followers`);
      if (!res?.ok)
        throw new Error(
          ((await res?.json()) ?? {}).message || "Failed to fetch followers"
        );
      return res.json() as Promise<SafeFollowDto[]>;
    },
  });
}

export function useFollowGetFollowing(id: number) {
  return useQuery({
    queryKey: followKeys.following(id),
    enabled: !!id,
    queryFn: async () => {
      const res = await api(`/follow/${id}/following`);
      if (!res?.ok)
        throw new Error(
          ((await res?.json()) ?? {}).message || "Failed to fetch following"
        );
      return res.json() as Promise<SafeFollowDto[]>;
    },
  });
}

export function useFollowCreate() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: FollowDto) => {
      const res = await api("/follow/create", {
        method: "POST",
        body: JSON.stringify(dto),
      });
      if (!res?.ok)
        throw new Error(
          ((await res?.json()) ?? {}).message || "Failed to follow user"
        );
      return res.json() as Promise<SafeFollowDto>;
    },
    onSuccess: (data) => {
      enqueueSnackbar("Followed user!", { variant: "success" });
      queryClient.invalidateQueries({
        queryKey: followKeys.followers(data.following.id),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.following(data.follower.id),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.isFollowing(data.follower.id, data.following.id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.following.id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.follower.id),
      });
    },

    onError: (err: Error) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useFollowRemove() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api(`/follow/${id}`, { method: "DELETE" });
      if (!res?.ok)
        throw new Error(
          ((await res?.json()) ?? {}).message || "Failed to unfollow user"
        );
      return res.json() as Promise<SafeFollowDto>;
    },
    onSuccess: (data) => {
      enqueueSnackbar("Unfollowed user!", { variant: "success" });
      queryClient.invalidateQueries({
        queryKey: followKeys.followers(data.following.id),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.following(data.follower.id),
      });
      queryClient.invalidateQueries({
        queryKey: followKeys.isFollowing(data.follower.id, data.following.id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.following.id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.follower.id),
      });
    },

    onError: (err: Error) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
