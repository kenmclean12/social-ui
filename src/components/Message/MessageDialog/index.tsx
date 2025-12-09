import type { MessageResponseDto } from "../../../types";
import { useMessageFindOne } from "../../../hooks";
import { MessageBubble } from "../MessageBubble";
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
      <MessageBubble
        message={message as MessageResponseDto}
        isSelf={true}
        dialog
      />
    </UniversalDialog>
  );
}
