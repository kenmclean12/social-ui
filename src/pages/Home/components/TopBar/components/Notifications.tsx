import { useState } from "react";
import {
  IconButton,
  Popover,
  Typography,
  Badge,
  Stack,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../../../../../context";
import { useNotificationStream } from "../../../../../hooks/notification";

export function Notifications() {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  useNotificationStream(user?.id as number);

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ color: "#6BB6FF" }}
      >
        <Badge badgeContent={0} color="error">
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
          sx: { width: 250, backgroundColor: "#1e1e1e", color: "#fff", p: 1 },
        }}
      >
        <Stack spacing={1}>
          <Typography sx={{ fontSize: 14, textAlign: "center" }}>
            No notifications found
          </Typography>
        </Stack>
      </Popover>
    </>
  );
}
