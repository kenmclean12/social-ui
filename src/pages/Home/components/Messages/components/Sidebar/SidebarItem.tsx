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

export function SidebarItem({ conversation, selected, onClick }: SidebarItemProps) {
  const initiator = conversation.initiator;

  return (
    <ListItemButton
      onClick={onClick}
      selected={selected}
      sx={{ borderBottom: "1px solid #eee", py: 1.5 }}
    >
      <ListItemAvatar>
        <Avatar src={initiator?.avatarUrl} />
      </ListItemAvatar>
    <Typography>{initiator?.firstName} {initiator?.lastName}</Typography>
    </ListItemButton>
  );
}
