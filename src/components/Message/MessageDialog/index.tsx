import { Dialog, DialogTitle, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMessageFindOne } from "../../../hooks";
import { MessageBubble } from "../MessageBubble";

interface MessageDialogProps {
  open: boolean;
  messageId: number | null;
  onClose: () => void;
}

export function MessageDialog({ open, messageId, onClose }: MessageDialogProps) {
  const { data: message, isLoading } = useMessageFindOne(messageId as number);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#090909",
          border: "1px solid #333",
          color: "white",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          paddingY: 1.5,
          borderBottom: "1px solid #222",
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
          Message
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{ marginLeft: "auto", color: "red" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        {isLoading && (
          <Typography align="center" p={3}>
            Loading message...
          </Typography>
        )}
        {!isLoading && message && (
          <Stack spacing={1} p={1} pt={1.5}>
            <MessageBubble message={message} isMe={true} />
          </Stack>
        )}
        {!isLoading && !message && (
          <Typography align="center" color="white" p={3}>
            Message not found.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
