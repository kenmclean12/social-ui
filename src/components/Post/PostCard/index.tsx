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
import { useLikeCreate, useLikeDelete } from "../../../hooks";
import { ReactionPanel } from "../../ReactionPanel";
import { paperStyles } from "./styles";

interface Props {
  post: PostResponseDto;
  width?: string | number;
  height?: string | number;
}

export function PostCard({
  post: initialPost,
  width = "100%",
  height = "auto",
}: Props) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState<boolean>(false);
  const [post, setPost] = useState<PostResponseDto>(initialPost);
  const { mutate: createLike } = useLikeCreate();
  const { mutate: removeLike } = useLikeDelete();

  const hasLiked = useMemo(
    () => post.likes?.some((l) => l.userId === user?.id),
    [post.likes, user?.id]
  );
  const hasCommented = useMemo(
    () => post.comments?.some((c) => c.user.id === user?.id),
    [post.comments, user?.id]
  );

  const handleToggleLike = () => {
    if (!user) return;

    if (!hasLiked) {
      createLike(
        { userId: user.id, postId: post.id },
        {
          onSuccess: (like) => {
            setPost((prev) => ({
              ...prev,
              likes: [...(prev.likes ?? []), like],
            }));
          },
        }
      );
    } else {
      const like = post.likes?.find((l) => l.userId === user?.id);
      if (!like) return;
      removeLike(like.id, {
        onSuccess: () => {
          setPost((prev) => ({
            ...prev,
            likes: prev.likes?.filter((l) => l.id !== like.id),
          }));
        },
      });
    }
  };

  return (
    <Paper sx={{ ...paperStyles, height, width }}>
      <Slide direction="right" in={!showComments} mountOnEnter appear={false}>
        <Stack spacing={1} sx={{ height: "100%" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={post.creator.avatarUrl} />
            <Typography color="white" fontWeight="bold">
              {post.creator
                ? `${post.creator.firstName} ${post.creator.lastName}`
                : "Unknown User"}
            </Typography>
          </Stack>
          <Divider sx={{ backgroundColor: "#444" }} />
          <MediaSection url={post.contentUrl} height={300} />
          <Typography color="white" p={1} pt={2} pb={2}>
            {post.textContent}
          </Typography>
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
                {post.likes?.length || 0}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconButton onClick={() => setShowComments(true)}>
                <ChatBubble
                  sx={{ color: hasCommented ? "lightblue" : "white" }}
                />
              </IconButton>
              <Typography sx={{ color: hasCommented ? "lightblue" : "white" }}>
                {post.comments?.length || 0}
              </Typography>
            </Stack>
            <ReactionPanel
              entityType="post"
              entityId={post.id}
              reactionEntries={post.reactions ?? []}
              isSelf={post.creator.id === user?.id}
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
              Comments ({post.comments?.length || 0})
            </Typography>
          </Stack>
          <Divider sx={{ backgroundColor: "#444", my: 1 }} />
          <CommentSection comments={post.comments} postId={post.id} />
        </Stack>
      </Slide>
    </Paper>
  );
}
