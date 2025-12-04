import { useState, useMemo } from "react";
import {
  Avatar,
  IconButton,
  Stack,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Close, ThumbUp, ChatBubble } from "@mui/icons-material";
import { useAuth } from "../../../../../../context";
import type { CommentResponseDto } from "../../../../../../types";
import {
  useCommentCreate,
  useCommentDelete,
  useLikeCreate,
  useLikeDelete,
  useLikeFind,
} from "../../../../../../hooks";
import { ReactionPanel } from "../../ReactionPanel";

interface CommentLineProps {
  comment: CommentResponseDto;
  isReply?: boolean;
}

export function CommentLine({ comment, isReply }: CommentLineProps) {
  const { user } = useAuth();
  const { mutateAsync: createLike } = useLikeCreate();
  const { mutateAsync: deleteLike } = useLikeDelete();
  const { mutateAsync: deleteComment } = useCommentDelete();
  const createComment = useCommentCreate();

  const { data: likes } = useLikeFind("comment", comment.id);
  const hasLiked = useMemo(() => {
    return likes?.some((l) => l.userId === user?.id);
  }, [likes, user?.id]);

  const isAuthor = user?.id === comment.user.id;

  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const toggleLike = () => {
    if (!user || isAuthor) return;
    if (!hasLiked) {
      createLike({ userId: user.id, commentId: comment.id });
    } else {
      const like = likes?.find((l) => l.userId === user.id);
      if (like) deleteLike(like.id);
    }
  };

  const submitReply = () => {
    if (!user || !replyText.trim()) return;
    createComment.mutate(
      {
        userId: user.id,
        postId: comment.postId,
        parentCommentId: comment.id,
        content: replyText.trim(),
      },
      {
        onSuccess: () => {
          setReplyText("");
          setShowReplyInput(false);
          setShowReplies(true);
        },
      }
    );
  };

  const replyCount = comment.replies?.length || 0;

  return (
    <Stack spacing={0.5} sx={{ mb: 1 }}>
      <Stack
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
            <Stack direction="row" alignItems="center" sx={{ gap: 0.2 }}>
              {!isReply && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.25}
                  pr={2}
                >
                  <IconButton
                    size="small"
                    onClick={() => setShowReplies(!showReplies)}
                  >
                    <ChatBubble
                      sx={{
                        color: replyCount > 0 ? "lightblue" : "white",
                      }}
                    />
                  </IconButton>
                  <Typography
                    sx={{
                      color: hasLiked ? "lightblue" : "white",
                      fontSize: 14,
                    }}
                  >
                    {replyCount}
                  </Typography>
                </Stack>
              )}
              <IconButton size="small" onClick={toggleLike} disabled={isAuthor}>
                <ThumbUp sx={{ color: hasLiked ? "lightblue" : "white" }} />
              </IconButton>
              <Typography
                sx={{ color: hasLiked ? "lightblue" : "white", fontSize: 14 }}
              >
                {likes ? likes.length : 0}
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
      {showReplyInput && (
        <Stack direction="row" spacing={1} pl={5}>
          <TextField
            size="small"
            placeholder="Write a reply..."
            fullWidth
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{
              backgroundColor: "#1e1e1e",
              borderRadius: 1,
              input: { color: "white" },
            }}
          />
          <Button
            variant="contained"
            onClick={submitReply}
            disabled={!replyText.trim()}
          >
            Send
          </Button>
        </Stack>
      )}
      {showReplies && replyCount > 0 && (
        <Stack spacing={1} pl={5}>
          {comment.replies &&
            comment.replies.map((reply) => (
              <CommentLine key={reply.id} comment={reply} isReply />
            ))}
        </Stack>
      )}
    </Stack>
  );
}
