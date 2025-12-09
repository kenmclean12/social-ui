import type { ReactNode } from "react";
import { Avatar, Paper, Stack, Typography, Tooltip } from "@mui/material";
import type { UserResponseDto } from "../../../types";
import { FollowButton } from "../../Follow";
import { contentContainerStyles, paperStyles } from "./styles";

interface Props {
  user: UserResponseDto;
  showUserName?: boolean;
  showFollowButton?: boolean;
  showFollowButtonSmall?: boolean;
  button?: ReactNode;
  message?: string;
  color?: string;
  hoverColor?: string;
  onClick?: (id: number) => void;
}

export function UserRow({
  user,
  showUserName = false,
  showFollowButton = false,
  showFollowButtonSmall = false,
  button,
  message,
  color,
  hoverColor,
  onClick,
}: Props) {
  const fullName = message || `${user.firstName} ${user.lastName}`;

  return (
    <Paper
      sx={{
        ...paperStyles,
        cursor: "pointer",
        backgroundColor: color ?? "black",
        "&:hover": {
          backgroundColor: hoverColor ?? "#101",
        },
      }}
      onClick={() => onClick?.(user.id)}
    >
      <Stack sx={contentContainerStyles}>
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
        direction="row"
        paddingLeft="12px"
        onClick={(e) => e.stopPropagation()}
        sx={{ pointerEvents: "auto" }}
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
      {button && !showFollowButton && !showFollowButtonSmall && <>{button}</>}
    </Paper>
  );
}
