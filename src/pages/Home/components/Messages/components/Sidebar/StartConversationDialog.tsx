import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useConversationInitiate, useFollowGetFollowing } from "../../../../../../hooks";
import type { ConversationResponseDto } from "../../../../../../types";

interface StartConversationDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export function StartConversationDialog({ open, onClose, userId }: StartConversationDialogProps) {
  const { data } = useFollowGetFollowing(userId);
  const { mutate: initiate } = useConversationInitiate();
  const [selected, setSelected] = useState<ConversationResponseDto | null>(null);

  const handleStart = () => {
    if (!selected) return;
    initiate(
      { targetUserId: selected.following.id },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Start Conversation</DialogTitle>

      <DialogContent>
        <Autocomplete
          options={data || []}
          getOptionLabel={(o) => o.following.name}
          value={selected}
          onChange={(_, v) => setSelected(v)}
          renderInput={(params) => (
            <TextField {...params} label="Select user" />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleStart} variant="contained">
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
}
