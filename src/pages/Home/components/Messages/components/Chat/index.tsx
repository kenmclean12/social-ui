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
  useConversationFindOne,
} from "../../../../../../hooks";
import { formatDayLabel } from "../../../../../../utils";
import { MessageBubble } from "../../../../../../components";

interface ChatWindowProps {
  conversationId: number;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");

  const { data: conversation } = useConversationFindOne(conversationId);
  const { data = [], isLoading } = useMessageFindByConversation(conversationId);
  const { mutate: sendMessage } = useMessageCreate();

  const isClosed = conversation?.closed === true;

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [data]);

  const handleSend = () => {
    if (!content.trim() || isClosed) return;
    sendMessage(
      { content, senderId: user?.id as number, conversationId },
      { onSuccess: () => setContent("") }
    );
  };

  if (isLoading) return <Box p={2}>Loading...</Box>;

  return (
    <Box display="flex" flexDirection="column" width="100%" height="100%">
      <Box
        ref={scrollRef}
        flex={1}
        p={2}
        sx={{
          overflowY: "auto",
          backgroundColor: "black",
        }}
      >
        {isClosed && (
          <Box
            sx={{
              background: "#331111",
              border: "1px solid #552222",
              borderRadius: "6px",
              p: 2,
              mb: 2,
            }}
          >
            <Typography
              align="center"
              sx={{ color: "#ff9999", fontSize: 14, fontWeight: 500 }}
            >
              This conversation has been closed by{" "}
              <strong>{conversation?.initiator?.firstName}</strong>.
            </Typography>
          </Box>
        )}
        {data.length > 0 ? (
          data.map((msg, idx) => {
            const msgDate = new Date(msg.createdAt);
            const prevDate = idx > 0 ? new Date(data[idx - 1].createdAt) : null;

            const showDivider =
              !prevDate || prevDate.toDateString() !== msgDate.toDateString();

            return (
              <Box key={msg.id}>
                {showDivider && (
                  <Box my={1} display="flex" alignItems="center">
                    <Divider sx={{ flex: 1, borderColor: "#333" }} />
                    <Typography
                      sx={{
                        mx: 1,
                        color: "#777",
                        fontSize: 12,
                        userSelect: "none",
                      }}
                    >
                      {formatDayLabel(msgDate)}
                    </Typography>
                    <Divider sx={{ flex: 1, borderColor: "#333" }} />
                  </Box>
                )}
                <MessageBubble
                  message={msg}
                  isSelf={msg.sender.id === user?.id}
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
        square
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          width: "100%",
          p: 1,
          borderTop: "1px solid #333",
          background: "#111",
        }}
      >
        <TextField
          fullWidth
          placeholder={
            isClosed
              ? "Conversation is closed. You cannot send messages."
              : "Type a message…"
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          inputProps={{ maxLength: 500 }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isClosed) handleSend();
          }}
          disabled={isClosed}
          sx={{
            input: { color: isClosed ? "#777" : "white" },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!content.trim() || isClosed}
          sx={{ color: isClosed ? "#555" : "lightblue", ml: 1 }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
