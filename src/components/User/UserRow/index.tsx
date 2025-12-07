import { Avatar, Paper, Stack, Typography, Tooltip } from "@mui/material";
import type { UserResponseDto } from "../../../types";
import { FollowButton } from "../../Follow";

interface UserRowProps {
  user: UserResponseDto;
  showUserName?: boolean;
  showFollowButton?: boolean;
  message?: string;
  onClick?: (id: number) => void;
}

export function UserRow({
  user,
  showUserName = false,
  showFollowButton = true,
  message,
  onClick,
}: UserRowProps) {
  const fullName = message
    ? message
    : `${user.firstName} ${user.lastName}`;

  return (
    <Paper
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        backgroundColor: "black",
        cursor: onClick ? "pointer" : "default",
        transition: "background-color 0.15s ease",
        "&:hover": {
          backgroundColor: "#101",
        },
      }}
      onClick={() => onClick?.(user.id)}
    >
      {/* Left side: avatar + name */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Avatar src={user.avatarUrl} sx={{ width: 35, height: 35 }} />

        <Tooltip title={fullName}>
          <Typography
            color="white"
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fullName} {showUserName && `(@${user.userName})`}
          </Typography>
        </Tooltip>
      </Stack>
      <Stack
        flexDirection="row"
        paddingLeft="12px"
        style={{
          pointerEvents: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showFollowButton && <FollowButton targetUserId={user.id} />}
      </Stack>
    </Paper>
  );
}
