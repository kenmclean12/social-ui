import {
  Avatar,
  Box,
  ListItemButton,
  Typography,
  IconButton,
  Popover,
  Stack,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Settings } from "@mui/icons-material";
import type { ConversationResponseDto } from "../../../../../../../types";
import { useAuth } from "../../../../../../../context";
import { useState } from "react";
import { ChatMembers } from "./ChatMembers";
import { UpdateConversationDialog } from "../UpdateConversationDialog";
import { DeleteConversationDialog } from "../DeleteConversationDialog";
import { useUnreadMessageCountByConversation } from "../../../../../../../hooks";

interface Props {
  conversation: ConversationResponseDto;
  selected: boolean;
  onClick: () => void;
}

export function SidebarItem({ conversation, selected, onClick }: Props) {
  const { user } = useAuth();
  const { participants, initiator } = conversation;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [updateAnchor, setUpdateAnchor] = useState<HTMLElement | null>(null);
  const [deleteAnchor, setDeleteAnchor] = useState<HTMLElement | null>(null);
  const { data: unreadCount } = useUnreadMessageCountByConversation(
    conversation.id
  );
  const hasUnreadMessages = typeof unreadCount === "number" && unreadCount > 0;
  let others = participants?.filter((p) => p.id !== user?.id);
  if (initiator && initiator.id !== user?.id) {
    others = [initiator, ...others];
  }

  const isGroup = others.length > 1;
  let primaryName = "";
  let extraParticipants: typeof others = [];

  if (!isGroup) {
    const target = others[0];
    primaryName = target
      ? `${target.firstName ?? ""} ${target.lastName ?? ""}`.trim()
      : "Unknown User";
  } else {
    const displayed = others
      .slice(0, 2)
      .map((o) => o?.firstName ?? "Unknown")
      .join(", ");

    extraParticipants = others.slice(2);
    const extraCount = extraParticipants.length;

    primaryName =
      extraCount > 0 ? `${displayed}, +${extraCount} more…` : displayed;
  }

  return (
    <>
      <ListItemButton
        onClick={onClick}
        selected={selected}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #222",
          py: 1.5,
          color: "white",
          backgroundColor: "#1e1e1e",
          "&:hover": {
            backgroundColor: selected ? "#101" : "rgba(255,255,255,0.05)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
          <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
            {isGroup ? (
              <Box
                sx={{
                  position: "relative",
                  width: 45,
                  height: 35,
                  ml: -1.25,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setAnchorEl(e.currentTarget);
                }}
              >
                <Avatar
                  src={!isGroup ? others[0]?.avatarUrl : initiator?.avatarUrl}
                  sx={{
                    position: "absolute",
                    left: 8,
                    width: 30,
                    height: 30,
                    border: "2px solid #111",
                    zIndex: 1,
                  }}
                />
                {extraParticipants.length > 0 && (
                  <Typography
                    sx={{
                      position: "absolute",
                      left: 24,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "2px solid #111",
                      bgcolor: "gray",
                      color: "white",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 3,
                      userSelect: "none",
                    }}
                  >
                    +{extraParticipants.length}
                  </Typography>
                )}
              </Box>
            ) : (
              <Avatar
                src={!isGroup ? others[0]?.avatarUrl : initiator?.avatarUrl}
                sx={{
                  width: 35,
                  height: 35,
                  border: "2px solid #111",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setAnchorEl(e.currentTarget);
                }}
              />
            )}
          </Box>
          <Box sx={{ overflow: "hidden" }}>
            <Typography fontSize={15} color="white" noWrap>
              {primaryName}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          {hasUnreadMessages && (
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "lightblue",
                mr: 1.5,
              }}
            />
          )}
          {user?.id === conversation.initiator.id && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setMenuAnchor(e.currentTarget);
              }}
              sx={{ color: "white" }}
            >
              <Settings />
            </IconButton>
          )}
        </Stack>
      </ListItemButton>
      <Popover
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e1e",
            minWidth: 200,
            padding: "5px 0",
            border: "1px solid #444",
          },
        }}
      >
        <Stack spacing={1}>
          <MenuItem
            onClick={() => {
              setUpdateAnchor(menuAnchor);
              setMenuAnchor(null);
            }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              color: "white",
            }}
          >
            Update <Edit sx={{ color: "lightblue", height: 20 }} />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeleteAnchor(menuAnchor);
              setMenuAnchor(null);
            }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              color: "white",
            }}
          >
            Delete <Delete sx={{ color: "red", height: 20 }} />
          </MenuItem>
        </Stack>
      </Popover>
      <UpdateConversationDialog
        open={Boolean(updateAnchor)}
        onClose={() => setUpdateAnchor(null)}
        conversation={conversation}
      />
      <DeleteConversationDialog
        open={Boolean(deleteAnchor)}
        onClose={() => setDeleteAnchor(null)}
        conversationId={conversation.id}
      />
      <ChatMembers
        initiator={initiator}
        members={participants}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      />
    </>
  );
}
