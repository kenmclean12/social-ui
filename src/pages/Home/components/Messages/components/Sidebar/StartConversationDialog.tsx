import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useConversationInitiate, useFollowGetFollowing } from "../../../../../../hooks";
import { useAuth } from "../../../../../../context";
import type { FollowResponseDto } from "../../../../../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export function StartConversationDialog({ open, onClose, userId }: Props) {
  const { user } = useAuth();
  const [selectedUsers, setSelectedUsers] = useState<FollowResponseDto[]>([]);
  const [message, setMessage] = useState<string>("");
  const { data = [] } = useFollowGetFollowing(userId);
  const { mutate: initiate } = useConversationInitiate();

  const handleStart = () => {
    if (selectedUsers.length === 0 || !message.trim()) return;

    initiate(
      {
        conversation: {
          initiatorId: user!.id,
          recipientIds: selectedUsers.map((f) => f.following.id),
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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Start Conversation</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Autocomplete
            multiple
            options={data}
            value={selectedUsers}
            getOptionLabel={(o) => o.following.userName}
            onChange={(_, v) => setSelectedUsers(v)}
            renderInput={(params) => (
              <TextField {...params} label="Select users" />
            )}
          />
          <TextField
            label="First message"
            multiline
            minRows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleStart}
          variant="contained"
          disabled={selectedUsers.length === 0 || !message.trim()}
        >
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
}
