import { useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  ThumbUp,
  ChatBubble,
  EmojiEmotions,
} from "@mui/icons-material";
import {
  type PostResponseDto, 
} from "../../../types";
import { useUserFindOne } from "../../../hooks";

interface PostProps {
  post: PostResponseDto;
  width?: string | number;
  height?: string | number;
}

export function PostCard({ post, width = "100%", height = "auto" }: PostProps) {
  const [hover, setHover] = useState<boolean>(false);
  const { data: creator } = useUserFindOne(post.creatorId);

  return (
    <Paper
      sx={{
        width,
        height,
        maxHeight: 600,
        p: 2,
        backgroundColor: "#1e1e1e",
        border: "1px solid #444",
        borderRadius: 2,
        cursor: "default",
        transition: "0.2s",
        "&:hover": { boxShadow: hover ? "0 0 15px lightblue" : "none" },
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={creator?.avatarUrl} />
          <Typography color="white" fontWeight="bold">
            {creator
              ? `${creator.firstName} ${creator.lastName}`
              : "Unknown User"}
          </Typography>
        </Stack>

        <Typography color="white">{post.title || ""}</Typography>
        <Typography color="white">{post.textContent || ""}</Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Stack direction="row" alignItems="center" sx={{ color: "lightblue", gap: .2, fontSize: 15 }}>
            <IconButton>
              <ThumbUp sx={{ color: "lightblue" }} />
            </IconButton>
            <Typography>{post.likeCount}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ color: "lightblue", gap: .2, fontSize: 15 }}>
            <IconButton>
              <ChatBubble sx={{ color: "lightblue" }} />
            </IconButton>
            <Typography>{post.commentCount}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ color: "lightblue", gap: .2, fontSize: 15 }}>
            <IconButton>
              <EmojiEmotions sx={{ color: "lightblue" }} />
            </IconButton>
            <Typography>{post.reactionCount}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
