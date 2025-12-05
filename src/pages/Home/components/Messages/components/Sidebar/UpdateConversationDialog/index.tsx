import { useState } from "react";
import { useAuth } from "../../../../../../../context";
import type { ConversationResponseDto, UserResponseDto } from "../../../../../../../types";
import { useConversationAlterParticipants, useConversationUpdate, useFollowGetFollowing } from "../../../../../../../hooks";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, FormControlLabel, Switch } from "@mui/material";

interface UpdateConversationDialogProps {
  open: boolean;
  onClose: () => void;
  conversation: ConversationResponseDto;
}

export function UpdateConversationDialog({
  open,
  onClose,
  conversation,
}: UpdateConversationDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(conversation.name || "");
  const [selectedUsers, setSelectedUsers] = useState<UserResponseDto[]>(conversation.participants);
  const [closed, setClosed] = useState(conversation.closed || false);
  const { data: following = [] } = useFollowGetFollowing(user!.id);
  const { mutateAsync: updateConversation } = useConversationUpdate();
  const { mutateAsync: alterParticipants } = useConversationAlterParticipants();

  const userOptions = following.map((f) => f.following);

  const handleUpdate = async () => {
    setLoading(true);

    if (title !== conversation.name || closed !== conversation.closed) {
      await updateConversation({ id: conversation.id, dto: { name: title, closed } });
    }

    const initialIds = conversation.participants.map((u) => u.id);
    const selectedIds = selectedUsers.map((u) => u.id);

    const addedIds = selectedIds.filter((id) => !initialIds.includes(id));
    const removedIds = initialIds.filter((id) => !selectedIds.includes(id));

    if (addedIds.length) {
      await alterParticipants({ id: conversation.id, dto: { recipientIds: addedIds, alterType: "add" } });
    }

    if (removedIds.length) {
      await alterParticipants({ id: conversation.id, dto: { recipientIds: removedIds, alterType: "remove" } });
    }

    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Update Conversation</DialogTitle>
      <DialogContent>
        <Stack spacing={2} p={1}>
          <TextField
            label="Conversation title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <Autocomplete
            multiple
            options={userOptions}
            value={selectedUsers}
            getOptionLabel={(u) => u.userName}
            onChange={(_, v) => setSelectedUsers(v)}
            renderInput={(params) => <TextField {...params} label="Participants" />}
          />
          <FormControlLabel
            control={<Switch checked={closed} onChange={(_, v) => setClosed(v)} />}
            label="Close Conversation"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate} disabled={loading}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}
