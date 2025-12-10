import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { PresignUrlDto, PresignUrlDtoResponseDto } from "../../types";

export function useMinioPresignUrl() {
  return useMutation({
    mutationFn: async (dto: PresignUrlDto) => {
      const res = await api("/minio/url", {
        method: "POST",
        body: JSON.stringify(dto),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to get presigned URL");
      }

      return res.json() as Promise<PresignUrlDtoResponseDto>;
    },
  });
}
