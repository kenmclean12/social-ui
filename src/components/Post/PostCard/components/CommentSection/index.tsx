import { useState } from "react";
import { Stack, Paper, TextField, Button, Divider } from "@mui/material";
import { useAuth } from "../../../../../context";
import type {
  CommentCreateDto,
  CommentResponseDto,
} from "../../../../../types";
import { useCommentCreate } from "../../../../../hooks/comment";
import { CommentLine } from "./components";

interface CommentSectionProps {
  comments: CommentResponseDto[] | undefined;
  postId: number;
}

export function CommentSection({ comments, postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState<string>("");
  const createComment = useCommentCreate();

  const handleCreate = () => {
    if (!newComment.trim() || !user) return;
    const dto: CommentCreateDto = {
      userId: user.id,
      postId,
      content: newComment.trim(),
    };
    createComment.mutate(dto, { onSuccess: () => setNewComment("") });
  };

  return (
    <Paper
      sx={{
        p: 2,
        maxHeight: 250,
        overflowY: "auto",
        backgroundColor: "#2a2a2a",
        border: "1px solid #444",
        borderRadius: 1,
      }}
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
        <Divider sx={{ backgroundColor: "#444" }} />
        {comments?.map((comment) => (
          <CommentLine comment={comment} />
        ))}
      </Stack>
    </Paper>
  );
}
