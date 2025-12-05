import {
  Avatar,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import type { ConversationResponseDto } from "../../../../../../types";

interface SidebarItemProps {
  conversation: ConversationResponseDto;
  selected: boolean;
  onClick: () => void;
  userId: number;
}

export function SidebarItem({ conversation, selected, onClick, userId }: SidebarItemProps) {
  const other = conversation.participants.find((p) => p.id !== userId);

  return (
    <ListItemButton
      onClick={onClick}
      selected={selected}
      sx={{ borderBottom: "1px solid #eee", py: 1.5 }}
    >
      <ListItemAvatar>
        <Avatar src={other?.avatarUrl} />
      </ListItemAvatar>
      <ListItemText
        primary={other?.userName}
      />
    </ListItemButton>
  );
}
