import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { api } from "../lib/api";
import type { NotificationCreateDto, SafeNotificationDto } from "../types";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const notificationKeys = {
  all: ["notifications"] as const,
  detail: (id: number) => ["notifications", id] as const,
};

export function useNotificationFindAll() {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: async () => {
      const res = await api("/notification");

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch notifications");
      }

      return res.json() as Promise<SafeNotificationDto[]>;
    },
  });
}

export function useNotificationCreate() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: NotificationCreateDto) => {
      const res = await api("/notification", {
        method: "POST",
        body: JSON.stringify(dto),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to create notification");
      }

      return res.json() as Promise<SafeNotificationDto>;
    },
    onSuccess: () => {
      enqueueSnackbar("Notification created!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: "error" });
    },
  });
}

export function useNotificationUpdate() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async ({ id, read }: { id: number; read: boolean }) => {
      const res = await api(`/notification/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ read }),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to update notification");
      }
      return res.json() as Promise<SafeNotificationDto>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: "error" });
    },
  });
}

export function useNotificationStream(userId: number) {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userId) return;

    const socket = io(`${import.meta.env.VITE_API_URL}/notifications`, {
      auth: { userId },
    });

    socket.on("notification", (notif) => {
      qc.setQueryData<SafeNotificationDto[]>(["notifications"], (old) => {
      return [notif, ...(old ?? [])];
    });

      enqueueSnackbar("New notification", { variant: "info" });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, qc, enqueueSnackbar]);
}
