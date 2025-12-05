import {
  Avatar,
  Box,
  ListItemButton,
  Typography,
  IconButton,
} from "@mui/material";
import type { ConversationResponseDto } from "../../../../../../../types";
import { useAuth } from "../../../../../../../context";
import { useState } from "react";
import { ChatMembers } from "./ChatMembers";

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
        backgroundColor: selected ? "rgba(100,170,255,0.15)" : "transparent",
        "&:hover": {
          backgroundColor: selected
            ? "rgba(100,170,255,0.22)"
            : "rgba(255,255,255,0.05)",
        },
      }}
    >
      <Box sx={{ mr: 2, width: 35, display: "flex", alignItems: "center" }}>
        {!isGroup && (
          <Avatar
            src={others[0]?.avatarUrl}
            sx={{ width: 35, height: 35, border: "2px solid #111" }}
          />
        )}
        {isGroup && (
          <Box
            sx={{ position: "relative", width: 35, height: 35, ml: -1.25 }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Avatar
              src={others[0]?.avatarUrl}
              sx={{
                position: "absolute",
                left: 0,
                width: 35,
                height: 35,
                border: "2px solid #111",
                zIndex: 2,
              }}
            />
            <Avatar
              src={others[1]?.avatarUrl}
              sx={{
                position: "absolute",
                left: 20,
                width: 35,
                height: 35,
                border: "2px solid #111",
                zIndex: 1,
              }}
            />
            {others.length > 1 && (
              <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  width: 20,
                  height: 20,
                  position: "absolute",
                  bottom: -8,
                  right: -20,
                  zIndex: 10,
                  borderRadius: "50%",
                  border: "1px solid #444",
                  backgroundColor: "#222",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                <Typography sx={{ fontSize: 11 }}>
                  +{others.length - 2}
                </Typography>
              </IconButton>
            )}
          </Box>
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
      <ChatMembers
        members={others}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      />
    </ListItemButton>
  );
}
