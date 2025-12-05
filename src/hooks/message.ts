import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type {
  MessageCreateDto,
  MessageReadResponseDto,
  MessageResponseDto,
  MessageUpdateDto,
} from "../types";
import { api } from "../lib/api";

export function useMessageFindOne(id: number) {
  return useQuery({
    queryKey: ["message", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api(`/message/${id}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch message");
      }
      return res.json() as Promise<MessageResponseDto>;
    },
  });
}

export function useMessageFindByConversation(conversationId: number) {
  return useQuery({
    queryKey: ["messages", "conversation", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const res = await api(`/message/conversation/${conversationId}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(
          err.message || "Failed to fetch messages for conversation"
        );
      }
      return res.json() as Promise<MessageResponseDto[]>;
    },
  });
}

export function useMessageCreate() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: MessageCreateDto) => {
      const res = await api(`/message`, {
        method: "POST",
        body: JSON.stringify(dto),
      });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to send message");
      }
      return res.json() as Promise<MessageResponseDto>;
    },

    onSuccess: (data) => {
      enqueueSnackbar("Message sent!", { variant: "success" });
      qc.invalidateQueries({
        queryKey: ["messages", "conversation", data.conversationId],
      });
    },

    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useMessageMarkRead() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (params: { messageId: number; userId: number }) => {
      const res = await api(
        `/message/${params.messageId}/read/${params.userId}`,
        { method: "POST" }
      );
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to mark message read");
      }
      return res.json() as Promise<MessageReadResponseDto>;
    },

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["message", data.messageId] });
      qc.invalidateQueries({ queryKey: ["messages", "conversation", data.conversationId] })
      enqueueSnackbar("Message marked as read", { variant: "info" });
    },

    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useMessageUpdate() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (params: { id: number; dto: MessageUpdateDto }) => {
      const res = await api(`/message/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(params.dto),
      });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to update message");
      }
      return res.json() as Promise<MessageResponseDto>;
    },

    onSuccess: (data) => {
      enqueueSnackbar("Message updated", { variant: "success" });
      qc.invalidateQueries({ queryKey: ["message", data.id] });
      qc.invalidateQueries({
        queryKey: ["messages", "conversation", data.conversationId],
      });
    },

    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useMessageDelete() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api(`/message/${id}`, { method: "DELETE" });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to delete message");
      }
      return res.json() as Promise<MessageResponseDto>;
    },

    onSuccess: (data) => {
      enqueueSnackbar("Message deleted", { variant: "success" });
      qc.invalidateQueries({
        queryKey: ["messages", "conversation", data.conversationId],
      });
    },

    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
