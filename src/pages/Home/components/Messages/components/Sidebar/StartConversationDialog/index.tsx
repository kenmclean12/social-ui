import { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useAuth } from "../../../../../../../context";
import type { UserResponseDto } from "../../../../../../../types";
import {
  useConversationInitiate,
  useFollowGetFollowing,
} from "../../../../../../../hooks";
import {
  UniversalDialog,
  UserMultiSelect,
} from "../../../../../../../components";
import {
  dialogFooterStackStyles,
  cancelButtonStyles,
  startButtonStyles,
  stackContainerStyles,
} from "./styles";
import { textFieldStyles } from "../../../../../../styles";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export function StartConversationDialog({ open, onClose, userId }: Props) {
  const { user } = useAuth();
  const [selectedUsers, setSelectedUsers] = useState<UserResponseDto[]>([]);
  const [message, setMessage] = useState<string>("");
  const { data = [] } = useFollowGetFollowing(userId);
  const { mutate: initiate } = useConversationInitiate();

  const handleStart = () => {
    if (selectedUsers.length === 0 || !message.trim()) return;
    initiate(
      {
        conversation: {
          initiatorId: user!.id,
          recipientIds: selectedUsers.map((u) => u.id),
        },
        firstMessage: {
          senderId: user!.id,
          content: message,
        },
      },
      {
        onSuccess: () => {
          setSelectedUsers([]);
          setMessage("");
          onClose();
        },
      }
    );
  };

  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Start Conversation"
      footer={
        <Stack sx={dialogFooterStackStyles}>
          <Button onClick={onClose} sx={cancelButtonStyles}>
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            variant="outlined"
            disabled={selectedUsers.length === 0 || !message.trim()}
            sx={startButtonStyles}
          >
            Start
          </Button>
        </Stack>
      }
    >
      <Stack sx={stackContainerStyles}>
        <UserMultiSelect
          label="Select Users"
          data={data?.map((f) => f.following)}
          value={selectedUsers}
          onChange={(selected) => setSelectedUsers(selected)}
        />
        <TextField
          label="First message"
          multiline
          minRows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={textFieldStyles}
          fullWidth
        />
      </Stack>
    </UniversalDialog>
  );
}
