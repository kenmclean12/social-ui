import { Box, TextField, IconButton, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { useAuth } from "../../../../../../context";
import {
  useMessageFindByConversation,
  useMessageCreate,
} from "../../../../../../hooks";

interface ChatWindowProps {
  conversationId: number;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { user } = useAuth();
  const { data = [], isLoading } = useMessageFindByConversation(conversationId);
  const { mutate: sendMessage } = useMessageCreate();

  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  const handleSend = () => {
    if (!content.trim()) return;

    sendMessage(
      {
        content,
        senderId: user?.id as number,
        conversationId,
      },
      {
        onSuccess: () => setContent(""),
      }
    );
  };

  if (isLoading) return <Box p={2}>Loading...</Box>;

  return (
    <Box height="100%" display="flex" flexDirection="column">
      {/* MESSAGES LIST */}
      <Box
        ref={scrollRef}
        flex={1}
        overflow="auto"
        p={2}
        display="flex"
        flexDirection="column"
      >
        {data.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            isMe={m.sender.id === user?.id}
          />
        ))}
      </Box>
      <Paper
        elevation={3}
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #444",
          background: "#111",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          sx={{
            input: { color: "white" },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!content.trim()}
          sx={{ color: "#4aa3ff", ml: 1 }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
