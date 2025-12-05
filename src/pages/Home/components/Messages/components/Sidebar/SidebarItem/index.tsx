import {
  Avatar,
  Box,
  ListItemButton,
  Typography,
  Stack
} from "@mui/material";
import type { ConversationResponseDto } from "../../../../../../../types";
import { useAuth } from "../../../../../../../context";

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
  const { user } = useAuth();
  const { participants, initiator } = conversation;
  const others = participants.filter((p) => p.id !== user?.id);

  const isGroup = others.length > 1;
  const primaryName = isGroup
    ? others.map((o) => o.firstName).join(", ")
    : `${others[0]?.firstName} ${others[0]?.lastName}`;

  const secondaryText = initiator.id === user?.id ? "Started by you" : null;

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
      }}
    >
      <Box sx={{ mr: 2, border: "1px solid white" }}>
        {isGroup ? (
          <Stack direction="row" sx={{ position: "relative", width: 30 }}>
            <Avatar
              src={others[0]?.avatarUrl}
              sx={{
                width: 25,
                height: 25,
                border: "2px solid #111",
                position: "absolute",
                left: 0,
                bottom: -20,
              }}
            />
            <Avatar
              src={others[1]?.avatarUrl}
              sx={{
                width: 25,
                height: 25,
                border: "2px solid #111",
                position: "absolute",
                left: 18,
                bottom: -20,
              }}
            />
          </Stack>
        ) : (
          <Avatar
            src={others[0]?.avatarUrl}
            sx={{ width: 30, height: 30 }}
          />
        )}
      </Box>
      <Box sx={{ overflow: "hidden" }}>
        <Typography fontSize={15} color="white" noWrap>
          {primaryName}
        </Typography>
        {secondaryText && (
          <Typography fontSize={12} color="gray" noWrap>
            {secondaryText}
          </Typography>
        )}
      </Box>
    </ListItemButton>
  );
}
