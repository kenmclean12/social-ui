import { useState } from "react";
import { Stack, Paper, TextField, Button, Divider } from "@mui/material";
import { useAuth } from "../../../../../context";
import type { CommentCreateDto } from "../../../../../types";
import { CommentLine } from "./components";
import { useCommentCreate, useCommentFindByPost } from "../../../../../hooks";
import { textFieldStyles } from "../../../../../pages/styles";
import { paperStyles } from "./styles";

interface Props {
  postId: number;
}

export function CommentSection({ postId }: Props) {
  const { user } = useAuth();
  const { data: comments } = useCommentFindByPost(postId);
  const [newComment, setNewComment] = useState<string>("");
  const createComment = useCommentCreate();

  const handleCreate = () => {
    if (!newComment.trim() || !user) return;
    const dto: CommentCreateDto = {
      userId: user.id,
      postId,
      content: newComment.trim(),
    };
    createComment.mutate(dto, {
      onSuccess: () => {
        setNewComment("");
      },
    });
  };

  return (
    <Paper sx={paperStyles}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} mt={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Write a comment..."
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={textFieldStyles}
          />
          <Button
            variant="outlined"
            onClick={handleCreate}
            sx={{
              border: "1px solid lightblue",
              color: "lightblue",
            }}
            disabled={!newComment.trim()}
          >
            Send
          </Button>
        </Stack>
        <Divider sx={{ backgroundColor: "#444" }} />
        {comments?.map((comment) => (
          <CommentLine comment={comment} isReply={false} />
        ))}
      </Stack>
    </Paper>
  );
}
