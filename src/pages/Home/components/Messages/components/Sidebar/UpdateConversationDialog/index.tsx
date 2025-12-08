import { useMemo, useState } from "react";
import { useAuth } from "../../../../../../../context";
import type {
  ConversationResponseDto,
  UserResponseDto,
} from "../../../../../../../types";
import {
  useConversationAlterParticipants,
  useConversationUpdate,
  useFollowGetFollowing,
} from "../../../../../../../hooks";
import {
  Button,
  Stack,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  UniversalDialog,
  UserMultiSelect,
} from "../../../../../../../components";
import { textFieldStyles } from "../../../../../../styles";
import {
  cancelButtonStyles,
  dialogFooterStackStyles,
  stackContainerStyles,
  switchLabelStyles,
  switchStyles,
  updateButtonStyles,
} from "./styles";

interface Props {
  open: boolean;
  onClose: () => void;
  conversation: ConversationResponseDto;
}

export function UpdateConversationDialog({
  open,
  onClose,
  conversation,
}: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(conversation.name || "");
  const [closed, setClosed] = useState<boolean>(conversation.closed || false);
  const [selectedUsers, setSelectedUsers] = useState<UserResponseDto[]>(
    conversation.participants
  );

  const { data: following = [] } = useFollowGetFollowing(user!.id);
  const { mutateAsync: updateConversation } = useConversationUpdate();
  const { mutateAsync: alterParticipants } = useConversationAlterParticipants();

  const handleUpdate = async () => {
    setLoading(true);

    if (title !== conversation.name || closed !== conversation.closed) {
      await updateConversation({
        id: conversation.id,
        dto: { name: title, closed },
      });
    }

    const initialIds = conversation.participants.map((u) => u.id);
    const selectedIds = selectedUsers.map((u) => u.id);

    const addedIds = selectedIds.filter((id) => !initialIds.includes(id));
    const removedIds = initialIds.filter((id) => !selectedIds.includes(id));

    if (addedIds.length) {
      await alterParticipants({
        id: conversation.id,
        dto: { recipientIds: addedIds, alterType: "add" },
      });
    }

    if (removedIds.length) {
      await alterParticipants({
        id: conversation.id,
        dto: { recipientIds: removedIds, alterType: "remove" },
      });
    }

    setLoading(false);
    onClose();
  };

  const hasChanges = useMemo(() => {
    const initialIds = conversation.participants.map((u) => u.id).sort();
    const selectedIds = selectedUsers.map((u) => u.id).sort();

    const participantsChanged =
      initialIds.length !== selectedIds.length ||
      initialIds.some((id, idx) => id !== selectedIds[idx]);

    return (
      title !== (conversation.name || "") ||
      closed !== (conversation.closed || false) ||
      participantsChanged
    );
  }, [
    conversation.participants,
    conversation.name,
    conversation.closed,
    selectedUsers,
    title,
    closed,
  ]);

  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Update Conversation"
      footer={
        <Stack sx={dialogFooterStackStyles}>
          <Button onClick={onClose} sx={cancelButtonStyles}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleUpdate}
            disabled={loading || !hasChanges}
            sx={updateButtonStyles}
          >
            Update
          </Button>
        </Stack>
      }
    >
      <Stack sx={stackContainerStyles}>
        <TextField
          label="Conversation title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={textFieldStyles}
        />
        <UserMultiSelect
          label="Participants"
          data={following.map((f) => f.following)}
          value={selectedUsers}
          onChange={setSelectedUsers}
        />
        <FormControlLabel
          control={
            <Switch
              checked={closed}
              onChange={(_, v) => setClosed(v)}
              sx={switchStyles}
            />
          }
          label="Close Conversation"
          sx={switchLabelStyles}
        />
      </Stack>
    </UniversalDialog>
  );
}
