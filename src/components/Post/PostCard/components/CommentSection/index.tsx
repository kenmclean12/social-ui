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
import { Close } from "@mui/icons-material";
import {
  useCommentFindByPost,
  useCommentCreate,
  useCommentDelete,
} from "../../../../../hooks/comment";
import { useAuth } from "../../../../../context";
import type { Comment, CommentCreateDto } from "../../../../../types";

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const { data: comments = [] } = useCommentFindByPost(postId);
  const createComment = useCommentCreate();
  const deleteComment = useCommentDelete();
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

    createComment.mutate(dto, {
      onSuccess: () => setNewComment(""),
    });
  };

  const handleDelete = (id: number) => {
    deleteComment.mutate(id);
  };

  return (
    <Paper
      sx={{
        mt: 2,
        p: 1,
        maxHeight: 300,
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
        {comments.map((comment: Comment) => (
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
            <Stack spacing={0.5} flex={1}>
              <Typography fontSize={12} color="white">
                {comment.user.firstName} {comment.user.lastName} (@
                {comment.user.userName})
              </Typography>
              <Typography fontSize={14} color="white">
                {comment.content}
              </Typography>
            </Stack>
            {comment.user.id === user?.id && (
              <IconButton
                size="small"
                onClick={() => handleDelete(comment.id)}
                sx={{ color: "red" }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
