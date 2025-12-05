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
import {
  useNotificationFindAll,
  useNotificationStream,
  useNotificationUpdate,
} from "../../../../../hooks/notification";
import {
  type SafeNotificationDto,
  NotificationType,
} from "../../../../../types";
import { ProfileDialog } from "../../../../Profile";

export function Notifications() {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);
  const [profileUserId, setProfileUserId] = useState<number | null>(null);

  useNotificationStream(user?.id as number);
  const { data: notifications = [] } = useNotificationFindAll();
  const updateNotification = useNotificationUpdate();

  console.log(notifications);

  const handleOpenProfile = (userId: number) => {
    setProfileUserId(userId);
    setProfileDialogOpen(true);
  };

  const handleNotificationClick = (notif: SafeNotificationDto) => {
    if (!notif.read) {
      updateNotification.mutate({ id: notif.id, read: true });
    }

    if (notif.type === NotificationType.FOLLOW && notif.actionUser) {
      handleOpenProfile(notif.actionUser.id);
      setAnchorEl(null);
    }
  };

  const renderNotificationText = (notif: SafeNotificationDto) => {
    const actorName = `${notif.actionUser.firstName} ${notif.actionUser.lastName}`;

    switch (notif.type) {
      case NotificationType.FOLLOW:
        return `${actorName} started following you`;

      case NotificationType.LIKE:
        if (notif.post) return `${actorName} liked your post`;
        if (notif.comment) return `${actorName} liked your comment`;
        if (notif.message) return `${actorName} liked your message`;
        return `${actorName} liked your content`;

      case NotificationType.REACT:
        if (notif.post) return `${actorName} reacted to your post`;
        if (notif.comment) return `${actorName} reacted to your comment`;
        if (notif.message) return `${actorName} reacted to your message`;
        return `${actorName} reacted to your content`;

      case NotificationType.COMMENT:
        if (notif.post) return `${actorName} commented on your post`;
        if (notif.comment) return `${actorName} replied to your comment`;
        return `${actorName} commented`;

      case NotificationType.MESSAGE:
        if (notif.message) return `${actorName} sent you a message`;
        return `${actorName} sent something`;

      default:
        return `${actorName} did something`;
    }
  };

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ color: "lightblue" }}
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
          sx: {
            width: 300,
            overflowY: "auto",
            backgroundColor: "#1e1e1e",
            border: "1px solid #444",
            color: "#fff",
            p: 1,
          },
        }}
      >
        <Stack spacing={1} sx={{ maxHeight: 400, overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Typography align="center" pt={2} pb={2} sx={{ fontSize: 14 }}>
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
                onClick={() => handleNotificationClick(notif)}
              >
                <Avatar
                  src={notif.actionUser.avatarUrl}
                  alt={notif.actionUser.userName}
                  sx={{ width: 25, height: 25 }}
                />
                <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                  {renderNotificationText(notif)}
                </Typography>
              </Stack>
            ))
          )}
        </Stack>
      </Popover>
      {profileUserId !== null && (
        <ProfileDialog
          open={profileDialogOpen}
          userId={profileUserId}
          onClose={() => setProfileDialogOpen(false)}
        />
      )}
    </>
  );
}
