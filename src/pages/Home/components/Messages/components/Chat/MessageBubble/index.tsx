import { useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { MessageResponseDto } from "../../../../../../../types";
import { ReactionPanel } from "../../../../../../../components/Post/PostCard/components";
import { useAuth } from "../../../../../../../context";
import {
  useLikeCreate,
  useLikeDelete,
  useLikeFind,
} from "../../../../../../../hooks";

interface MessageBubbleProps {
  message: MessageResponseDto;
  isMe: boolean;
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const { user } = useAuth();
  const { data: likes = [] } = useLikeFind("message", message.id);
  const { mutateAsync: createLike } = useLikeCreate();
  const removeLike = useLikeDelete();

  const myLike = useMemo(
    () => likes.find((l) => l.userId === user?.id),
    [likes, user]
  );

  const handleToggleLike = () => {
    if (isMe) return;

    if (myLike) {
      removeLike.mutate(myLike.id);
    } else {
      createLike({
        userId: user?.id as number,
        messageId: message.id,
      });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={isMe ? "flex-end" : "flex-start"}
      mb={2}
    >
      {!isMe && (
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <Avatar
            src={message.sender.avatarUrl}
            sx={{ width: 28, height: 28 }}
          />
          <Typography fontSize={13} color="#ccc">
            {message.sender.firstName} {message.sender.lastName}
          </Typography>
        </Stack>
      )}

      <Paper
        elevation={2}
        sx={{
          maxWidth: "75%",
          p: 1.3,
          background: isMe ? "#1976d2" : "#2a2a2a",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Typography fontSize={15}>{message.content}</Typography>
      </Paper>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.2}
        mt={0.5}
        sx={{ opacity: 0.9 }}
      >
        <ReactionPanel
          entityType="message"
          entityId={message.id}
          isSelf={isMe}
          direction="right"
        />
        <Stack direction="row" alignItems="center" spacing={0.3}>
          <IconButton
            size="small"
            onClick={handleToggleLike}
            sx={{
              color: myLike ? "lightblue" : "white",
              p: 0.3,
              opacity: isMe ? 0.4 : 1,
            }}
          >
            {myLike ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
          <Typography fontSize={13} color="white">
            {likes.length}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
