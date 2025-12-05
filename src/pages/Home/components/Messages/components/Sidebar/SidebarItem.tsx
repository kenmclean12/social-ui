import {
  Avatar,
  ListItemButton,
  ListItemAvatar,
  Typography,
} from "@mui/material";
import type { ConversationResponseDto } from "../../../../../../types";

interface SidebarItemProps {
  conversation: ConversationResponseDto;
  selected: boolean;
  onClick: () => void;
}

export function SidebarItem({
  conversation,
  selected,
  onClick,
}: SidebarItemProps) {
  const initiator = conversation.initiator;

  return (
    <ListItemButton
      onClick={onClick}
      selected={selected}
      sx={{
        borderBottom: "1px solid #222",
        py: 1.5,
        color: "white",
        backgroundColor: selected ? "rgba(100, 170, 255, 0.15)" : "transparent",
        "&:hover": {
          backgroundColor: selected
            ? "rgba(100, 170, 255, 0.22)"
            : "rgba(255, 255, 255, 0.05)",
        },
        "&.Mui-selected": {
          backgroundColor: "rgba(100, 170, 255, 0.18)",
        },
        "&.Mui-selected:hover": {
          backgroundColor: "rgba(100, 170, 255, 0.25)",
        },
      }}
    >
      <ListItemAvatar>
        <Avatar src={initiator?.avatarUrl} />
      </ListItemAvatar>
      <Typography color="white">
        {initiator?.firstName} {initiator?.lastName} (@{initiator?.userName})
      </Typography>
    </ListItemButton>
  );
}
