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
  NotificationType,
  type NotificationResponseDto,
} from "../../../../../types";
import { ProfileDialog } from "../../../../../components/Profile/ProfileDialog";
import { MessageDialog, PostDialog } from "../../../../../components";

export function Notifications() {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);
  const [profileUserId, setProfileUserId] = useState<number | null>(null);
  const [postDialogOpen, setPostDialogOpen] = useState<boolean>(false);
  const [postId, setPostId] = useState<number | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageId, setMessageId] = useState<number | null>(null);

  const { data: notifications = [] } = useNotificationFindAll();
  const updateNotification = useNotificationUpdate();
  useNotificationStream(user?.id as number);

  const handleNotificationClick = (notif: NotificationResponseDto) => {
    if (!notif.read) {
      updateNotification.mutate({ id: notif.id, read: true });
    }

    if (notif.type === NotificationType.FOLLOW && notif.actionUser) {
      setProfileUserId(notif.actionUser.id);
      setProfileDialogOpen(true);
      setAnchorEl(null);
    }

    if (
      notif.type === NotificationType.POST_LIKE ||
      notif.type === NotificationType.POST_REACTION ||
      notif.type === NotificationType.POST_COMMENT
    ) {
      if (notif.post?.id) {
        setPostId(notif.post.id);
        setPostDialogOpen(true);
        setAnchorEl(null);
      }
    }

    if (
      notif.type === NotificationType.MESSAGE_LIKE ||
      notif.type === NotificationType.MESSAGE_REACTION
    ) {
      setMessageId(notif.message?.id ?? null);
      setMessageDialogOpen(true);
      setAnchorEl(null);
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
            maxHeight: 400,
            width: 350,
            overflowY: "auto",
            backgroundColor: "#1e1e1e",
            border: "1px solid #444",
            color: "#fff",
          },
        }}
      >
        <Stack maxHeight={400} sx={{ overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Typography align="center" fontSize={14} pt={2} pb={2}>
              No notifications found
            </Typography>
          ) : (
            notifications.map((notif: NotificationResponseDto) => (
              <Stack
                key={notif.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1.5}
                p={2}
                borderRadius={1}
                onClick={() => handleNotificationClick(notif)}
                sx={{
                  backgroundColor: "black",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#101" },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    src={notif.actionUser.avatarUrl}
                    alt={notif.actionUser.userName}
                    sx={{ width: 25, height: 25 }}
                  />
                  <Typography sx={{ fontSize: 13, lineHeight: 1.2 }}>
                    {notif.notificationMessage}
                  </Typography>
                </Stack>
                {!notif.read && (
                  <Stack
                    sx={{
                      width: 8,
                      height: 8,
                      marginLeft: "auto",
                      borderRadius: "50%",
                      backgroundColor: "lightblue",
                    }}
                  />
                )}
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
      {postId !== null && (
        <PostDialog
          open={postDialogOpen}
          postId={postId}
          onClose={() => setPostDialogOpen(false)}
        />
      )}
      {messageId !== null && (
        <MessageDialog
          open={messageDialogOpen}
          messageId={messageId}
          onClose={() => setMessageDialogOpen(false)}
        />
      )}
    </>
  );
}
