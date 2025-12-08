import { useState } from "react";
import {
  IconButton,
  Popover,
  Badge,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../../../../../../context";
import {
  useNotificationFindAll,
  useNotificationStream,
  useNotificationUpdate,
} from "../../../../../../hooks";
import {
  NotificationType,
  type NotificationResponseDto,
} from "../../../../../../types";
import {
  MessageDialog,
  PostDialog,
  ProfileDialog,
  UserRow,
} from "../../../../../../components";
import { notificationIndicatorStyles, popoverStyles } from "./styles";

export function Notifications() {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileUserId, setProfileUserId] = useState<number | null>(null);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
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
      return;
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
      return;
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
          sx: popoverStyles,
        }}
      >
        <Stack sx={{ overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Typography align="center" fontSize={14} pt={2} pb={2} color="#bbb">
              No notifications found
            </Typography>
          ) : (
            notifications.map((notif) => (
              <Box
                key={notif.id}
                sx={{ position: "relative", mt: .5 }}
                onClick={() => handleNotificationClick(notif)}
              >
                <UserRow
                  user={notif.actionUser}
                  showFollowButton={false}
                  message={notif.notificationMessage}
                />
                {!notif.read && <Box sx={notificationIndicatorStyles} />}
              </Box>
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
