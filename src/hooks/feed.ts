import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { PostResponseDto } from "../types";
import { api } from "../lib/api";

export function useFeedPersonalized(userId: number, limit = 200) {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: ["feed", "personalized", userId, limit],
    enabled: !!userId,
    queryFn: async () => {
      const res = await api(
        `/feed/personalized?userId=${userId}&limit=${limit}`
      );

      if (!res?.ok) {
        const err = await res?.json();
        enqueueSnackbar(err.message || "Failed to load feed", {
          variant: "error",
        });
        throw new Error(err.message);
      }

      return res.json() as Promise<PostResponseDto[]>;
    },
  });
}

export function useFeedExplore(
  filter: "mostLiked" | "mostReacted" | "recent" | "oldest" = "recent",
  limit = 20
) {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: ["feed", "explore", filter, limit],
    queryFn: async () => {
      const res = await api(`/feed/explore?filter=${filter}&limit=${limit}`);

      if (!res?.ok) {
        const err = await res?.json();
        enqueueSnackbar(err.message || "Failed to load feed", {
          variant: "error",
        });
        throw new Error(err.message);
      }

      return res.json() as Promise<PostResponseDto[]>;
    },
  });
}
