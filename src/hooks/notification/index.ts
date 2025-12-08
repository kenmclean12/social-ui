import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { api } from "../../lib/api";
import type { NotificationResponseDto } from "../../types";

export function useNotificationFindAll() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api("/notification");
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch notifications");
      }
      return res.json() as Promise<NotificationResponseDto[]>;
    },
  });
}

export function useNotificationUpdate() {
  const qc = useQueryClient();
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
      return res.json() as Promise<NotificationResponseDto>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: Error) => enqueueSnackbar(err.message, { variant: "error" }),
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
      qc.setQueryData<NotificationResponseDto[]>(["notifications"], (old) => {
        return [notif, ...(old ?? [])];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, qc, enqueueSnackbar]);
}
