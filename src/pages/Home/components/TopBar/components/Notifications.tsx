import { useState } from "react";
import {
  IconButton,
  Popover,
  Badge,
  Stack,
  Avatar,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../../../../../context";
import { useNotificationStream, useNotificationFindAll } from "../../../../../hooks/notification";
import { type SafeNotificationDto, NotificationType } from "../../../../../types";

export function Notifications() {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useNotificationStream(user?.id as number);

  const { data: notifications = [] } = useNotificationFindAll();

  const renderNotificationText = (notif: SafeNotificationDto) => {
    const actorName = `${notif.actionUser.firstName} ${notif.actionUser.lastName}`;
    switch (notif.type) {
      case NotificationType.FOLLOW:
        return `${actorName} started following you`;
      case NotificationType.LIKE:
        if (notif.post) return `${actorName} liked your post`;
        if (notif.comment) return `${actorName} liked your comment`;
        if (notif.message) return `${actorName} liked your message`;
        return `${actorName} liked something`;
      case NotificationType.REACT:
        if (notif.post) return `${actorName} reacted to your post`;
        if (notif.comment) return `${actorName} reacted to your comment`;
        if (notif.message) return `${actorName} reacted to your message`;
        return `${actorName} reacted`;
      case NotificationType.COMMENT:
        if (notif.post) return `${actorName} commented on your post`;
        return `${actorName} commented`;
      case NotificationType.MESSAGE:
        return `${actorName} sent you a message`;
      default:
        return `${actorName} did something`;
    }
  };

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ color: "#6BB6FF" }}
      >
        <Badge
          badgeContent={notifications.filter((n) => !n.read).length}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 300, backgroundColor: "#1e1e1e", color: "#fff", p: 1 },
        }}
      >
        <Stack spacing={1} sx={{ maxHeight: 400, overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Typography pt={2} pb={2} sx={{ fontSize: 14, textAlign: "center" }}>
              No notifications found
            </Typography>
          ) : (
            notifications.map((notif: SafeNotificationDto) => (
              <Stack
                key={notif.id}
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: notif.read ? "transparent" : "#333",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#444" },
                }}
              >
                <Avatar
                  src={notif.actionUser.avatarUrl}
                  alt={notif.actionUser.userName}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                  {renderNotificationText(notif)}
                </Typography>
              </Stack>
            ))
          )}
        </Stack>
      </Popover>
    </>
  );
}
