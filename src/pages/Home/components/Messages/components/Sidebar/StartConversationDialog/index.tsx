import { useState } from "react";
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
import { useAuth } from "../../../../../../../context";
import type { FollowResponseDto } from "../../../../../../../types";
import { useConversationInitiate, useFollowGetFollowing } from "../../../../../../../hooks";

interface StartConversationDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export function StartConversationDialog({ open, onClose, userId }: StartConversationDialogProps) {
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
        Start Conversation
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2} p={1}>
          <Autocomplete
            multiple
            options={data}
            value={selectedUsers}
            getOptionLabel={(o) => o.following.userName}
            onChange={(_, v) => setSelectedUsers(v)}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#1a1a1a",
                color: "#fff",
                borderRadius: "8px",
                border: "1px solid #444",
              },
              "& .MuiSvgIcon-root": { color: "#ccc" },
              "& .MuiAutocomplete-tag": {
                backgroundColor: "#222",
                color: "#fff",
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select users"
                InputLabelProps={{ sx: { color: "#aaa" } }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#444",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#666",
                  },
                  "& .MuiInputBase-input": { color: "#fff" },
                }}
              />
            )}
          />
          <TextField
            label="First message"
            multiline
            minRows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            InputLabelProps={{ sx: { color: "#aaa" } }}
            sx={{
              backgroundColor: "#1a1a1a",
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#444",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#666",
              },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
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
          onClick={handleStart}
          variant="contained"
          disabled={selectedUsers.length === 0 || !message.trim()}
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            ":hover": { backgroundColor: "#1565c0" },
          }}
        >
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
}
