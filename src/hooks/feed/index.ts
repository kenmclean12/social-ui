import { useQuery } from "@tanstack/react-query";
import type { PostResponseDto } from "../../types";
import { api } from "../../lib/api";

export function useFeedPersonalized(userId: number, limit = 200) {
  return useQuery({
    queryKey: ["feed", "personalized", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await api(
        `/feed/personalized?userId=${userId}&limit=${limit}`
      );

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message);
      }

      return res.json() as Promise<PostResponseDto[]>;
    },
  });
}

export function useFeedExplore(
  userId: number,
  filter: "mostLiked" | "mostReacted" | "recent" | "oldest" = "recent",
  limit = 20
) {
  return useQuery({
    queryKey: ["feed", "explore", userId],
    queryFn: async () => {
      const res = await api(`/feed/explore?filter=${filter}&limit=${limit}`);

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message);
      }

      return res.json() as Promise<PostResponseDto[]>;
    },
  });
}
