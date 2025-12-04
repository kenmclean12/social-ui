import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import { useAuth } from "../../../../../../context";
import {
  useCommentDelete,
  useLikeCreate,
  useLikeDelete,
  useLikeFind,
} from "../../../../../../hooks";
import { Close, ThumbUp } from "@mui/icons-material";
import type { Comment } from "../../../../../../types";
import { ReactionPanel } from "../../ReactionPanel";

interface CommentLineProps {
  comment: Comment;
}

export function CommentLine({ comment }: CommentLineProps) {
  const { user } = useAuth();
  const { data: likes = [] } = useLikeFind("comment", comment.id);
  const { mutateAsync: createLike } = useLikeCreate();
  const { mutateAsync: deleteLike } = useLikeDelete();
  const { mutateAsync: deleteComment } = useCommentDelete();

  const isAuthor = user?.id === comment.user.id;
  const isLiked = likes.some((l) => l.user.id === user?.id);

  const toggleLike = () => {
    if (!user || isAuthor) return;
    if (!isLiked) {
      createLike({ userId: user.id, commentId: comment.id });
    } else {
      const like = likes.find((l) => l.user.id === user.id);
      if (like) deleteLike(like.id);
    }
  };

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
            <IconButton size="small" onClick={toggleLike} disabled={isAuthor}>
              <ThumbUp sx={{ color: isLiked ? "lightblue" : "white" }} />
            </IconButton>
            <Typography
              sx={{
                color: isLiked ? "lightblue" : "white",
                fontSize: 14,
              }}
            >
              {likes.length}
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
          onClick={() => deleteComment(comment.id)}
          sx={{ color: "red" }}
        >
          <Close fontSize="small" />
        </IconButton>
      )}
    </Stack>
  );
}
