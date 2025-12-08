import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AlterParticipantsDto,
  ConversationCreateDto,
  ConversationResponseDto,
  ConversationUpdateDto,
  InitiateConversationDto,
  InitiateConversationResponseDto,
} from "../../types";
import { api } from "../../lib/api";

export function useConversationFindOne(id: number) {
  return useQuery({
    queryKey: ["conversation", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api(`/conversation/${id}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch conversation");
      }
      return res.json() as Promise<ConversationResponseDto>;
    },
  });
}

export function useConversationFindByUser(userId: number) {
  return useQuery({
    queryKey: ["conversations", "user", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await api(`/conversation/conversations/${userId}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(
          err.message || "Failed to fetch conversations for user"
        );
      }
      return res.json() as Promise<ConversationResponseDto[]>;
    },
  });
}

export function useConversationLeave(userId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api(`/conversation/leave/${id}`, {
        method: "POST",
      });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to leave conversation");
      }
      return res.json() as Promise<ConversationResponseDto>;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["conversations", "user", userId],
      });
      qc.invalidateQueries({
        queryKey: ["conversation", data.id],
      });
    },
  });
}

export function useConversationCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (dto: ConversationCreateDto) => {
      const res = await api(`/conversation`, {
        method: "POST",
        body: JSON.stringify(dto),
      });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to create conversation");
      }
      return res.json() as Promise<ConversationResponseDto>;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["conversations", "user", data.initiator.id],
      });
    },
  });
}

export function useConversationInitiate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (dto: InitiateConversationDto) => {
      const res = await api(`/conversation/initiate`, {
        method: "POST",
        body: JSON.stringify(dto),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to initiate conversation");
      }

      return res.json() as Promise<InitiateConversationResponseDto>;
    },

    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["conversations", "user", data.conversation.initiator.id],
      });
      qc.invalidateQueries({
        queryKey: ["conversation", data.conversation.id],
      });
    },
  });
}
export function useConversationAlterParticipants() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number; dto: AlterParticipantsDto }) => {
      const res = await api(`/conversation/alter-participants/${params.id}`, {
        method: "POST",
        body: JSON.stringify(params.dto),
      });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to alter participants");
      }
      return res.json() as Promise<ConversationResponseDto>;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["conversation", data.id] });
      qc.invalidateQueries({
        queryKey: ["conversations", "user", data.initiator.id],
      });
    },
  });
}

export function useConversationUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: number; dto: ConversationUpdateDto }) => {
      const res = await api(`/conversation/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(params.dto),
      });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to update conversation");
      }
      return res.json() as Promise<ConversationResponseDto>;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["conversation", data.id] });
      qc.invalidateQueries({
        queryKey: ["conversations", "user", data.initiator.id],
      });
    },
  });
}

export function useConversationDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api(`/conversation/${id}`, { method: "DELETE" });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to delete conversation");
      }
      return res.json() as Promise<ConversationResponseDto>;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["conversations", "user", data.initiator.id],
      });
    },
  });
}
