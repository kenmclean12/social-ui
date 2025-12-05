import { useState } from "react";
import { useConversationDelete } from "../../../../../../../hooks";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface DeleteConversationDialogProps {
  open: boolean;
  onClose: () => void;
  conversationId: number;
}

export function DeleteConversationDialog({
  open,
  onClose,
  conversationId,
}: DeleteConversationDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { mutateAsync: deleteConversation } = useConversationDelete();

  const handleDelete = async () => {
    setLoading(true);
    await deleteConversation(conversationId);
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
      <DialogTitle sx={{ color: "#fff" }}>
        Delete Conversation
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#fff" }}>
          Are you sure you want to delete this conversation?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: "12px" }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ border: "1px solid #333", color: "#ccc", ":hover": { background: "#222" } }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          color="error"
          disabled={loading}
          sx={{ ":hover": { background: "#440000" } }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
