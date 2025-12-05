import { Box } from "@mui/material";
import { MessageBubble } from "./MessageBubble";
import { useConversationFindOne } from "../../../../../../hooks";
import { useAuth } from "../../../../../../context";

interface ChatWindowProps {
  conversationId: number;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { user } = useAuth();
  const { data, isLoading } = useConversationFindOne(conversationId);

  if (isLoading) return <Box p={2}>Loading...</Box>;

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box flex={1} overflow="auto" p={2}>
        {data?.messages?.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            isMe={Boolean(m.sender && user && m.sender.id === user.id)}
          />
        ))}
      </Box>
    </Box>
  );
}
