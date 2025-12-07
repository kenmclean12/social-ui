import { Stack } from "@mui/material";
import { useMessageFindOne } from "../../../hooks";
import { MessageBubble } from "../MessageBubble";
import type { MessageResponseDto } from "../../../types";
import { UniversalDialog } from "../../UniversalDialog";

interface Props {
  messageId: number | null;
  open: boolean;
  onClose: () => void;
}

export function MessageDialog({ messageId, open, onClose }: Props) {
  const { data: message, isLoading } = useMessageFindOne(messageId as number);

  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Message"
      hasContent={!!message}
      loading={isLoading}
      emptyMessage="Message not found"
    >
      <Stack>
        <MessageBubble
          message={message as MessageResponseDto}
          isSelf={true}
          dialog
        />
      </Stack>
    </UniversalDialog>
  );
}
