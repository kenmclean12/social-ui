import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../../../../../../context";
import {
  useMessageFindByConversation,
  useMessageCreate,
} from "../../../../../../hooks";
import { MessageBubble } from "./MessageBubble";
import { formatDayLabel } from "../../../../../../utils";

interface ChatWindowProps {
  conversationId: number;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>("");
  const { data = [], isLoading } = useMessageFindByConversation(conversationId);
  const { mutate: sendMessage } = useMessageCreate();

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [data]);

  const handleSend = () => {
    if (!content.trim()) return;

    sendMessage(
      { content, senderId: user?.id as number, conversationId },
      { onSuccess: () => setContent("") }
    );
  };

  if (isLoading) return <Box p={2}>Loading...</Box>;

  return (
    <Box display="flex" flexDirection="column" height="100%" maxHeight="84vh">
      <Box
        ref={scrollRef}
        display="flex"
        flex={1}
        flexDirection="column"
        p={2}
        sx={{
          overflowY: "auto",
        }}
      >
        {data.length === 0 ? (
          data.map((msg, idx) => {
            const msgDate = new Date(msg.createdAt);
            const prevDate = idx > 0 ? new Date(data[idx - 1].createdAt) : null;

            const showDivider =
              !prevDate || prevDate.toDateString() !== msgDate.toDateString();

            return (
              <Box key={msg.id}>
                {showDivider && (
                  <Box my={1} display="flex" alignItems="center">
                    <Divider sx={{ flex: 1, borderColor: "#555" }} />
                    <Typography
                      sx={{
                        mx: 1,
                        color: "#999",
                        fontSize: 12,
                        userSelect: "none",
                      }}
                    >
                      {formatDayLabel(msgDate)}
                    </Typography>
                    <Divider sx={{ flex: 1, borderColor: "#555" }} />
                  </Box>
                )}
                <MessageBubble
                  message={msg}
                  isMe={msg.sender.id === user?.id}
                />
              </Box>
            );
          })
        ) : (
          <Typography
            position="relative"
            top="45%"
            align="center"
            color="white"
          >
            No messages found
          </Typography>
        )}
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
          sx={{ input: { color: "white" } }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!content.trim()}
          sx={{ color: "lightblue", ml: 1 }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
