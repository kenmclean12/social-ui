import { useState, useMemo } from "react";
import {
  Avatar,
  Box,
  ListItemButton,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { Delete, Edit, Settings, ExitToApp } from "@mui/icons-material";
import type { ConversationResponseDto } from "../../../../../../../types";
import { useAuth } from "../../../../../../../context";
import { ChatMembers } from "./ChatMembers";
import { UpdateConversationDialog } from "../UpdateConversationDialog";
import { DeleteConversationDialog } from "../DeleteConversationDialog";
import {
  useConversationLeave,
  useUnreadMessageCountByConversation,
} from "../../../../../../../hooks";
import {
  avatarSecondaryStyles,
  avatarStyles,
  contentContainerStyles,
  extraCountStyles,
  listItemButtonStyles,
  unreadIndicatorContainerStyles,
} from "./styles";
import { PopoverMenu, PopoverMenuItem } from "../../../../../../../components";

interface Props {
  conversation: ConversationResponseDto;
  selected: boolean;
  onClick: () => void;
}

export function SidebarItem({ conversation, selected, onClick }: Props) {
  const { user } = useAuth();
  const { participants, initiator } = conversation;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const { data: unreadCount } = useUnreadMessageCountByConversation(
    conversation.id
  );
  const { mutateAsync: leaveConversation } = useConversationLeave(
    user?.id as number
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
        extraParticipants: [],
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

  const isOwner = user?.id === initiator?.id;

  return (
    <>
      <ListItemButton
        onClick={onClick}
        selected={selected}
        sx={listItemButtonStyles}
      >
        <Box display="flex" alignItems="center" overflow="hidden">
          <Box display="flex" alignItems="center" mr={1.6}>
            {hasUnreadMessages && <Box sx={unreadIndicatorContainerStyles} />}
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
          <Typography fontSize={13} color="white" noWrap>
            {primaryName}
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PopoverMenu
            trigger={
              <IconButton
                size="small"
                sx={{ color: "white" }}
                onClick={(e) => e.stopPropagation()}
              >
                <Settings />
              </IconButton>
            }
          >
            {isOwner ? (
              <>
                <PopoverMenuItem
                  label="Update"
                  iconRight={<Edit sx={{ color: "lightblue", height: 20 }} />}
                  closeOnSelect
                  onClick={() => setUpdateOpen(true)}
                />
                <PopoverMenuItem
                  label="Delete"
                  iconRight={<Delete sx={{ color: "red", height: 20 }} />}
                  closeOnSelect
                  onClick={() => setDeleteOpen(true)}
                />
              </>
            ) : (
              <PopoverMenuItem
                label="Leave Conversation"
                iconRight={<ExitToApp sx={{ height: 20, ml: 1, mt: 0.5 }} />}
                closeOnSelect
                onClick={() => leaveConversation(conversation.id)}
              />
            )}
          </PopoverMenu>
        </Stack>
      </ListItemButton>
      <UpdateConversationDialog
        open={updateOpen}
        conversation={conversation}
        onClose={() => setUpdateOpen(false)}
      />
      <DeleteConversationDialog
        open={deleteOpen}
        conversationId={conversation.id}
        onClose={() => setDeleteOpen(false)}
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
