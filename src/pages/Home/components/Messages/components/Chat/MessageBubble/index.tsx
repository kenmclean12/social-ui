import { Box, Paper, Typography } from "@mui/material";
import type { MessageResponseDto } from "../../../../../../../types";

interface MessageBubbleProps {
  message: MessageResponseDto;
  isMe: boolean;
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
  return (
    <Box
      display="flex"
      justifyContent={isMe ? "flex-end" : "flex-start"}
      mb={1.5}
    >
      <Paper
        elevation={1}
        sx={{
          maxWidth: "70%",
          p: 1.2,
          background: isMe ? "#1976d2" : "#eee",
          color: isMe ? "white" : "black",
        }}
      >
        <Typography>{message.content}</Typography>
      </Paper>
    </Box>
  );
}
