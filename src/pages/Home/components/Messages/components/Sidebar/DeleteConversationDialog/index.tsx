import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useConversationDelete } from "../../../../../../../hooks";
import { UniversalDialog } from "../../../../../../../components";
import { cancelButtonStyles } from "./styles";

interface Props {
  open: boolean;
  onClose: () => void;
  conversationId: number;
}

export function DeleteConversationDialog({
  open,
  onClose,
  conversationId,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { mutateAsync: deleteConversation } = useConversationDelete();

  const handleDelete = async () => {
    setLoading(true);
    await deleteConversation(conversationId);
    setLoading(false);
    onClose();
  };

  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Delete Conversation"
      footer={
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" onClick={onClose} sx={cancelButtonStyles}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            color="error"
            sx={{ ":hover": { background: "#440000" } }}
            disabled={loading}
          >
            Delete
          </Button>
        </Stack>
      }
    >
      <Typography sx={{ color: "#fff" }}>
        Are you sure you want to delete this conversation?
      </Typography>
    </UniversalDialog>
  );
}
