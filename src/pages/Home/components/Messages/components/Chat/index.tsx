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
import { textFieldStyles } from "../../../../../styles";
import {
  chatContainerStyles,
  conversationClosedContainerStyles,
  conversationClosedTextStyles,
  dateLabelStyles,
  inputContainerStyles,
  mainContainerStyles,
} from "./styles";

interface Props {
  conversationId: number;
}

export function ChatWindow({ conversationId }: Props) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>("");
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
    <Box sx={mainContainerStyles}>
      <Box ref={scrollRef} sx={chatContainerStyles}>
        {isClosed && (
          <Box sx={conversationClosedContainerStyles}>
            <Typography align="center" sx={conversationClosedTextStyles}>
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
                  <Box display="flex" alignItems="center" my={1}>
                    <Divider sx={{ flex: 1, borderColor: "#333" }} />
                    <Typography sx={dateLabelStyles}>
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
            align="center"
            position="relative"
            top="45%"
            color="white"
          >
            No messages found
          </Typography>
        )}
      </Box>
      <Paper elevation={3} square sx={inputContainerStyles}>
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
          sx={textFieldStyles}
        />
        <IconButton
          onClick={handleSend}
          disabled={!content.trim() || isClosed}
          sx={{
            color: isClosed ? "#555" : "lightblue",
            ml: 1,
          }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
