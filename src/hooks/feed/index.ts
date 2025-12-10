import { useInfiniteQuery } from "@tanstack/react-query";
import type { PostResponseDto, PaginatedResponseDto } from "../../types";
import { api } from "../../lib/api";

export function useFeedPersonalized(userId: number, limit = 20) {
  return useInfiniteQuery<PaginatedResponseDto<PostResponseDto>>({
    queryKey: ["feed", "personalized", userId],
    enabled: !!userId,
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const res = await api(
        `/feed/personalized?&page=${pageParam}&limit=${limit}`
      );

      if (!res?.ok) {
        const err = res
          ? await res.json()
          : { message: "No response from server" };
        throw new Error(err.message || "Failed to fetch personalized feed");
      }

      return res.json() as Promise<PaginatedResponseDto<PostResponseDto>>;
    },

    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },

    retry: 0,
  });
}

export function useFeedExplore(
  filter: "mostLiked" | "mostReacted" | "recent" | "oldest" = "recent",
  limit = 20
) {
  return useInfiniteQuery<PaginatedResponseDto<PostResponseDto>>({
    queryKey: ["feed", "explore", filter],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const res = await api(
        `/feed/explore?filter=${filter}&page=${pageParam}&limit=${limit}`
      );

      if (!res?.ok) {
        const err = res
          ? await res.json()
          : { message: "No response from server" };
        throw new Error(err.message || "Failed to fetch explore feed");
      }

      return res.json() as Promise<PaginatedResponseDto<PostResponseDto>>;
    },

    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },

    retry: 0,
  });
}
