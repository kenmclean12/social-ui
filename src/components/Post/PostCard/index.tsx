import { useMemo, useState } from "react";
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
} from "@mui/icons-material";
import {
  type PostResponseDto, 
} from "../../../types";
import { useLikeCreate, useLikeDelete, useLikeFind, useUserFindOne } from "../../../hooks";
import { useAuth } from "../../../context";
import { ReactionPanel } from "./components";

interface PostProps {
  post: PostResponseDto;
  width?: string | number;
  height?: string | number;
}

export function PostCard({ post, width = "100%", height = "auto" }: PostProps) {
  const { user } = useAuth();
  const [hover, setHover] = useState<boolean>(false);
  const { data: creator } = useUserFindOne(post.creatorId);
  const { data: likes, refetch } = useLikeFind("post", post.id);
  const { mutate: createLike } = useLikeCreate();
  const { mutate: removeLike } = useLikeDelete();
  const isLiked = useMemo(() => {
    return likes?.some((like) => like.user.id === user?.id);
  }, [likes, user?.id]);

  const handleToggleLike = async () => {
    if (user?.id === post.creatorId) return;
    if (!isLiked) {
      createLike({ userId: user?.id as number, postId: post.id });
      refetch();
    } else {
      const likeToRemove = likes?.find((like) => like.user.id === user?.id);
      if (likeToRemove) {
        removeLike(likeToRemove.id);
        refetch();
      }
    }
  }

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
            <IconButton onClick={handleToggleLike}>
              <ThumbUp sx={{ color: isLiked ? "lightblue" : "white" }} />
            </IconButton>
            <Typography sx={{ color: isLiked ? "lightblue" : "white" }}>{likes ? likes.length : 0}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ color: "lightblue", gap: .2, fontSize: 15 }}>
            <IconButton>
              <ChatBubble sx={{ color: "lightblue" }} />
            </IconButton>
            <Typography>{post.commentCount}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ color: "lightblue", gap: .2, fontSize: 15 }}>
            <ReactionPanel entityType="post" entityId={post.id} isSelf={user?.id === post.creatorId} />
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
