import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type {
  ContentCreateDto,
  ContentResponseDto,
  ContentUpdateDto,
} from "../types";
import { api } from "../lib/api";

export function useContentFindOne(id: number) {
  return useQuery({
    queryKey: ["content", id],
    queryFn: async () => {
      const res = await api(`/content/${id}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch content");
      }
      return res.json() as Promise<ContentResponseDto>;
    },
  });
}

export function useContentFindByPostId(postId: number) {
  return useQuery({
    queryKey: ["content_post", postId],
    enabled: !!postId,
    queryFn: async () => {
      const res = await api(`/content/post/${postId}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch contents for post");
      }
      return res.json() as Promise<ContentResponseDto[]>;
    },
  });
}

export function useContentFile(id: number) {
  return useQuery({
    queryKey: ["content_file", id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/content/${id}/file`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to fetch content file" }));
        throw new Error(err.message);
      }

      const blob = await res.blob();
      return URL.createObjectURL(blob);
    },
    enabled: !!id,
  });
}

export function useContentCreate() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: ContentCreateDto) => {
      const formData = new FormData();
      if (dto.postId) formData.append("postId", dto.postId.toString());
      if (dto.messageId) formData.append("messageId", dto.messageId.toString());
      formData.append("type", dto.type);
      formData.append("data", dto.data);
      if (dto.filename) formData.append("filename", dto.filename);

      const res = await api("/content", { method: "POST", body: formData });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to create content");
      }
      return res.json() as Promise<ContentResponseDto>;
    },
    onSuccess: () => {
      enqueueSnackbar("Content created!", { variant: "success" });
      qc.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useContentUpdate(id: number) {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: ContentUpdateDto) => {
      const res = await api(`/content/${id}`, {
        method: "PATCH",
        body: JSON.stringify(dto),
      });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to update content");
      }
      return res.json() as Promise<ContentResponseDto>;
    },
    onSuccess: () => {
      enqueueSnackbar("Content updated!", { variant: "success" });
      qc.invalidateQueries({ queryKey: ["content", id] });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useContentDelete(id: number) {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async () => {
      const res = await api(`/content/${id}`, { method: "DELETE" });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to delete content");
      }
      return res.json() as Promise<ContentResponseDto>;
    },
    onSuccess: () => {
      enqueueSnackbar("Content deleted!", { variant: "success" });
      qc.invalidateQueries({ queryKey: ["content", id] });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
