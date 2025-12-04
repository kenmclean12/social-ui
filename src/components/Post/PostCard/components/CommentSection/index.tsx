import { useState, useEffect, useRef } from "react";
import {
  Stack,
  Paper,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Close, ThumbUp } from "@mui/icons-material";
import { useAuth } from "../../../../../context";
import type { Comment, CommentCreateDto } from "../../../../../types";
import {
  useCommentFindByPost,
  useCommentCreate,
  useCommentDelete,
} from "../../../../../hooks/comment";
import {
  useLikeFind,
  useLikeCreate,
  useLikeDelete,
} from "../../../../../hooks/like";
import { ReactionPanel } from "../ReactionPanel";

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const { data: comments = [] } = useCommentFindByPost(postId);
  const createComment = useCommentCreate();
  const deleteComment = useCommentDelete();
  const { data: likesData = [] } = useLikeFind("comment", postId);
  const createLike = useLikeCreate();
  const deleteLike = useLikeDelete();
  const [newComment, setNewComment] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [comments]);

  const handleCreate = () => {
    if (!newComment.trim() || !user) return;

    const dto: CommentCreateDto = {
      userId: user.id,
      postId,
      content: newComment.trim(),
    };

    createComment.mutate(dto, { onSuccess: () => setNewComment("") });
  };

  const handleToggleLike = (commentId: number, authorId: number) => {
    if (!user || user.id === authorId) return;

    const commentLikes = likesData.filter((l) => l.comment?.id === commentId);
    const isLiked = commentLikes.some((l) => l.user.id === user.id);

    if (!isLiked) {
      createLike.mutate({ userId: user.id, commentId });
    } else {
      const likeToRemove = commentLikes.find((l) => l.user.id === user.id);
      if (likeToRemove) deleteLike.mutate(likeToRemove.id);
    }
  };

  return (
    <Paper
      sx={{
        mt: 2,
        p: 1,
        maxHeight: 350,
        overflowY: "auto",
        backgroundColor: "#2a2a2a",
        borderRadius: 1,
      }}
      ref={scrollRef}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} mt={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Write a comment..."
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{
              backgroundColor: "#1e1e1e",
              borderRadius: 1,
              input: { color: "white" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!newComment.trim()}
          >
            Send
          </Button>
        </Stack>
        {comments.map((comment: Comment) => {
          const commentLikes = likesData.filter(
            (l) => l.comment?.id === comment.id
          );
          const isLiked = commentLikes.some((l) => l.user.id === user?.id);
          const isAuthor = comment.user.id === user?.id;

          return (
            <Stack
              key={comment.id}
              direction="row"
              spacing={1}
              alignItems="flex-start"
              sx={{
                p: 1,
                backgroundColor: "#1e1e1e",
                borderRadius: 1,
              }}
            >
              <Avatar
                src={comment.user.avatarUrl || ""}
                sx={{ width: 30, height: 30 }}
              />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={0.5}
                width="100%"
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography fontSize={12} color="white">
                    {comment.user.firstName} {comment.user.lastName} (@
                    {comment.user.userName})
                  </Typography>
                  <Typography fontSize={14} color="white">
                    {comment.content}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} mt={0.5} pr={0.5}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ gap: 0.2, fontSize: 14 }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleToggleLike(comment.id, comment.user.id)
                      }
                      disabled={isAuthor}
                    >
                      <ThumbUp
                        sx={{ color: isLiked ? "lightblue" : "white" }}
                      />
                    </IconButton>
                    <Typography
                      sx={{
                        color: isLiked ? "lightblue" : "white",
                        fontSize: 14,
                      }}
                    >
                      {commentLikes.length}
                    </Typography>
                  </Stack>
                  <ReactionPanel
                    entityType="comment"
                    entityId={comment.id}
                    isSelf={isAuthor}
                  />
                </Stack>
              </Stack>
              {isAuthor && (
                <IconButton
                  size="small"
                  onClick={() => deleteComment.mutate(comment.id)}
                  sx={{ color: "red" }}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}
