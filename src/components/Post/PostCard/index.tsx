import { useMemo, useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Slide,
} from "@mui/material";
import { ThumbUp, ChatBubble, ArrowBack } from "@mui/icons-material";
import { type PostResponseDto } from "../../../types";
import { useAuth } from "../../../context";
import { CommentSection, MediaSection } from "./components";
import {
  useCommentFindByPost,
  useLikeCreate,
  useLikeDelete,
  useLikeFind,
  useUserFindOne,
} from "../../../hooks";
import { ReactionPanel } from "../../ReactionPanel";

interface PostProps {
  post: PostResponseDto;
  width?: string | number;
  height?: string | number;
}

export function PostCard({ post, width = "100%", height = "auto" }: PostProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const { data: creator } = useUserFindOne(post.creatorId);
  const { data: likes } = useLikeFind("post", post.id);
  const { data: comments } = useCommentFindByPost(post.id);
  const { mutate: createLike } = useLikeCreate();
  const { mutate: removeLike } = useLikeDelete();

  const hasLiked = useMemo(
    () => likes?.some((l) => l.userId === user?.id),
    [likes, user?.id]
  );
  const hasCommented = useMemo(
    () => comments?.some((c) => c.user.id === user?.id),
    [comments, user?.id]
  );

  const handleToggleLike = () => {
    if (!user) return;
    if (!hasLiked) createLike({ userId: user.id, postId: post.id });
    else {
      const like = likes?.find((l) => l.userId === user?.id);
      if (like) removeLike(like.id);
    }
  };

  return (
    <Paper
      sx={{
        height,
        width,
        minHeight: 400,
        minWidth: 450,
        maxHeight: 600,
        p: 2,
        backgroundColor: "#1e1e1e",
        border: "1px solid #444",
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Slide direction="right" in={!showComments} mountOnEnter>
        <Stack spacing={1} sx={{ height: "100%" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={creator?.avatarUrl} />
            <Typography color="white" fontWeight="bold">
              {creator
                ? `${creator.firstName} ${creator.lastName}`
                : "Unknown User"}
            </Typography>
          </Stack>
          <Divider sx={{ backgroundColor: "#444" }} />
          <MediaSection url={post.contentUrl} height={300} />
          <Typography color="white">{post.textContent}</Typography>
          <Divider sx={{ backgroundColor: "#444" }} />
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconButton onClick={handleToggleLike}>
                <ThumbUp sx={{ color: hasLiked ? "lightblue" : "white" }} />
              </IconButton>
              <Typography sx={{ color: hasLiked ? "lightblue" : "white" }}>
                {likes?.length || 0}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconButton onClick={() => setShowComments(true)}>
                <ChatBubble
                  sx={{ color: hasCommented ? "lightblue" : "white" }}
                />
              </IconButton>
              <Typography sx={{ color: hasCommented ? "lightblue" : "white" }}>
                {comments?.length || 0}
              </Typography>
            </Stack>
            <ReactionPanel
              entityType="post"
              entityId={post.id}
              isSelf={post.creatorId === user?.id}
            />
          </Stack>
        </Stack>
      </Slide>
      <Slide direction="left" in={showComments} mountOnEnter>
        <Stack
          spacing={1}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "#1e1e1e",
            p: 2,
            borderLeft: "1px solid #444",
            overflowY: "auto",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => setShowComments(false)}>
              <ArrowBack sx={{ color: "white" }} />
            </IconButton>
            <Typography color="white" fontWeight="bold">
              Comments ({comments?.length || 0})
            </Typography>
          </Stack>
          <Divider sx={{ backgroundColor: "#444", my: 1 }} />
          <CommentSection comments={comments} postId={post.id} />
        </Stack>
      </Slide>
    </Paper>
  );
}
