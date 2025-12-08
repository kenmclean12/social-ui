import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useConversationDelete } from "../../../../../../../hooks";
import { UniversalDialog } from "../../../../../../../components";

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
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              border: "1px solid #333",
              color: "#ccc",
              ":hover": { background: "#222" },
            }}
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
        </Stack>
      }
    >
      <Typography sx={{ color: "#fff" }}>
        Are you sure you want to delete this conversation?
      </Typography>
    </UniversalDialog>
  );
}
