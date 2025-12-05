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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Conversation</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this conversation?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} color="error" disabled={loading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
