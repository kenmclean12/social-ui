import { Avatar, Paper, Stack, Typography, Tooltip } from "@mui/material";
import type { UserResponseDto } from "../../../types";
import { FollowButton } from "../../Follow";
import { paperStyles } from "./styles";

interface Props {
  user: UserResponseDto;
  showUserName?: boolean;
  showFollowButton?: boolean;
  showFollowButtonSmall?: boolean;
  message?: string;
  onClick?: (id: number) => void;
}

export function UserRow({
  user,
  showUserName = false,
  showFollowButton = false,
  showFollowButtonSmall = false,
  message,
  onClick,
}: Props) {
  const fullName = message || `${user.firstName} ${user.lastName}`;

  return (
    <Paper
      sx={{
        ...paperStyles,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={() => onClick?.(user.id)}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        flex={1}
        minWidth={0}
      >
        <Avatar src={user.avatarUrl} sx={{ width: 30, height: 30 }} />
        <Tooltip title={fullName}>
          <Typography
            color="white"
            fontSize={message ? "13px" : "14px"}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            noWrap
          >
            {fullName} {showUserName && `(@${user.userName})`}
          </Typography>
        </Tooltip>
      </Stack>
      <Stack
        flexDirection="row"
        paddingLeft="12px"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: "auto" }}
      >
        {showFollowButtonSmall ? (
          <FollowButton
            targetUserId={user.id}
            size="small"
            displayText={false}
          />
        ) : showFollowButton ? (
          <FollowButton targetUserId={user.id} />
        ) : null}
      </Stack>
    </Paper>
  );
}
