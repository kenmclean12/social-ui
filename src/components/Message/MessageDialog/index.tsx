import { useMessageFindOne } from "../../../hooks";
import { MessageBubble } from "../MessageBubble";
import { UniversalDialog } from "../../UniversalDialog";
import type { MessageResponseDto } from "../../../types";

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
      content={
        <MessageBubble message={message as MessageResponseDto} isMe={true} />
      }
    />
  );
}
