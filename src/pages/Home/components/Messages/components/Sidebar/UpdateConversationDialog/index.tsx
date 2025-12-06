import { useState } from "react";
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
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Checkbox,
} from "@mui/material";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState(conversation.name || "");
  const [selectedUsers, setSelectedUsers] = useState<UserResponseDto[]>(
    conversation.participants
  );
  const [closed, setClosed] = useState(conversation.closed || false);
  const { data: following = [] } = useFollowGetFollowing(user!.id);
  const { mutateAsync: updateConversation } = useConversationUpdate();
  const { mutateAsync: alterParticipants } = useConversationAlterParticipants();

  const userOptions = following.map((f) => f.following);

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#0e0e0e",
          color: "#fff",
          border: "1px solid #444",
          boxShadow: "0 0 20px rgba(0,0,0,0.8)",
        },
      }}
    >
      <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #333" }}>
        Update Conversation
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} p={1}>
          <TextField
            label="Conversation title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{
              backgroundColor: "#1a1a1a",
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#666",
              },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
          />

          <Autocomplete
            multiple
            options={userOptions}
            value={selectedUsers}
            getOptionLabel={(u) => u.userName}
            onChange={(_, v) => setSelectedUsers(v)}
            disableCloseOnSelect
            PaperComponent={(props) => (
              <Box
                {...props}
                sx={{
                  maxHeight: "250px",
                  overflowY: "auto",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: 1,
                  mt: 1,
                  overflow: "hidden",
                }}
              />
            )}
            ListboxProps={{
              sx: {
                "& .MuiAutocomplete-option": {
                  color: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  "&.Mui-focused": { backgroundColor: "#222" },
                  "&.Mui-selected": { backgroundColor: "#222" },
                },
              },
            }}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                {option.userName}
                <Checkbox
                  checked={selected}
                  sx={{
                    color: "#1976d2",
                    "&.Mui-checked": { color: "#1976d2" },
                  }}
                />
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Participants"
                InputLabelProps={{ sx: { color: "#aaa" } }}
                sx={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#666",
                  },
                  "& .MuiInputBase-input": { color: "#fff" },
                  "& .MuiAutocomplete-tag": {
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    "& .MuiChip-deleteIcon": { color: "#fff" },
                  },
                }}
              />
            )}
          />
          <FormControlLabel
            control={
              <Switch
                checked={closed}
                onChange={(_, v) => setClosed(v)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#1976d2" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#1976d2",
                  },
                }}
              />
            }
            label="Close Conversation"
            sx={{ color: "#fff" }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid #333", padding: "12px" }}>
        <Button
          onClick={onClose}
          sx={{ color: "#ccc", ":hover": { background: "#222" } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          disabled={loading}
          sx={{
            color: "#fff",
            backgroundColor: "#1976d2",
            ":hover": { backgroundColor: "#1565c0" },
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
