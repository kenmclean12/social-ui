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
import { commentSectionContainerStyles, paperStyles } from "./styles";

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
            <Avatar src={post.creator?.avatarUrl} />
            <Typography color="white" fontWeight="bold">
              {post.creator
                ? `${post.creator.firstName} ${post.creator.lastName}`
                : "Unknown User"}
            </Typography>
          </Stack>
          <Divider sx={{ backgroundColor: "#444" }} />
          <MediaSection url={post.contentUrl} height={300} />
          <Stack height="150px" sx={{ overflowY: "auto" }}>
            <Typography color="white" p={1} pt={2} pb={2}>
              {post.textContent}
            </Typography>
          </Stack>
          <Divider sx={{ backgroundColor: "#444" }} />
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Stack direction="row" alignItems="center" spacing={1} mr={2}>
              <ThumbUp
                onClick={handleToggleLike}
                sx={{ color: hasLiked ? "lightblue" : "white" }}
              />
              <Typography sx={{ color: hasLiked ? "lightblue" : "white" }}>
                {post.likes?.length || 0}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} mr={1}>
              <ChatBubble
                onClick={() => setShowComments(true)}
                sx={{ color: hasCommented ? "lightblue" : "white" }}
              />
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
        <Stack sx={commentSectionContainerStyles}>
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
