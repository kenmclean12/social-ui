import { useState, useMemo } from "react";
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
import { ChatMembers } from "./ChatMembers";
import { UpdateConversationDialog } from "../UpdateConversationDialog";
import { DeleteConversationDialog } from "../DeleteConversationDialog";
import { useUnreadMessageCountByConversation } from "../../../../../../../hooks";
import {
  avatarSecondaryStyles,
  avatarStyles,
  contentContainerStyles,
  extraCountStyles,
  listItemButtonStyles,
  menuItemStyles,
  popoverPaperStyles,
  unreadIndicatorContainerStyles,
} from "./styles";

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
  const hasUnreadMessages = (unreadCount ?? 0) > 0;

  const otherParticipants = useMemo(() => {
    let others = participants?.filter((p) => p.id !== user?.id) ?? [];
    if (initiator && initiator.id !== user?.id) {
      others = [initiator, ...others];
    }
    return others;
  }, [participants, initiator, user?.id]);

  const isGroup = otherParticipants.length > 1;

  const { primaryName, extraParticipants } = useMemo(() => {
    if (!isGroup) {
      const target = otherParticipants[0];
      return {
        primaryName: target
          ? `${target.firstName ?? ""} ${target.lastName ?? ""}`.trim()
          : "Unknown User",
        extraParticipants: [] as typeof otherParticipants,
      };
    } else {
      const displayed = otherParticipants
        .slice(0, 2)
        .map((o) => o?.firstName ?? "Unknown")
        .join(", ");
      const extras = otherParticipants.slice(1);
      const extraCount = extras.length;
      return {
        primaryName:
          extraCount > 0 ? `${displayed}, +${extraCount} more…` : displayed,
        extraParticipants: extras,
      };
    }
  }, [otherParticipants, isGroup]);

  const avatarSrc = !isGroup
    ? otherParticipants[0]?.avatarUrl
    : initiator?.avatarUrl;

  return (
    <>
      <ListItemButton
        onClick={onClick}
        selected={selected}
        sx={listItemButtonStyles}
      >
        <Box display="flex" alignItems="center" overflow="hidden">
          <Box display="flex" alignItems="center" mr={isGroup ? 2 : 1.6}>
            {isGroup ? (
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  setAnchorEl(e.currentTarget);
                }}
                sx={contentContainerStyles}
              >
                <Avatar src={avatarSrc} sx={avatarStyles} />
                {extraParticipants.length > 0 && (
                  <Typography sx={extraCountStyles}>
                    +{extraParticipants.length}
                  </Typography>
                )}
              </Box>
            ) : (
              <Avatar
                src={avatarSrc}
                sx={avatarSecondaryStyles}
                onClick={(e) => {
                  e.stopPropagation();
                  setAnchorEl(e.currentTarget);
                }}
              />
            )}
          </Box>
          <Box sx={{ overflow: "hidden" }}>
            <Typography fontSize={13} color="white" noWrap>
              {primaryName}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          {hasUnreadMessages && <Box sx={unreadIndicatorContainerStyles} />}
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
        PaperProps={{ sx: popoverPaperStyles }}
      >
        <Stack spacing={1}>
          <MenuItem
            onClick={() => {
              setUpdateAnchor(menuAnchor);
              setMenuAnchor(null);
            }}
            sx={menuItemStyles}
          >
            Update <Edit sx={{ color: "lightblue", height: 20 }} />
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeleteAnchor(menuAnchor);
              setMenuAnchor(null);
            }}
            sx={menuItemStyles}
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
