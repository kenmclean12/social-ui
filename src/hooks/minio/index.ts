import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { api } from "../../lib/api";
import type { PresignUrlDto, PresignUrlDtoResponseDto } from "../../types";

export function useMinioPresignUrl() {
  const { enqueueSnackbar } = useSnackbar();

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
    onSuccess: (data) => {
      enqueueSnackbar("Presigned URL generated!", { variant: "success" });
      console.log("Upload URL:", data.uploadUrl);
      console.log("Final public URL:", data.finalUrl);
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: "error" });
    },
  });
}
