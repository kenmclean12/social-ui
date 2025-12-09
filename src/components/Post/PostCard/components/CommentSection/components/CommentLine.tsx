import { useState } from "react";
import {
  Avatar,
  IconButton,
  Stack,
  Typography,
  TextField,
  Button,
  Popover,
  MenuItem,
  Input,
} from "@mui/material";
import { ThumbUp, ChatBubble, Settings, Edit, Delete } from "@mui/icons-material";
import { useAuth } from "../../../../../../context";
import type { CommentResponseDto } from "../../../../../../types";
import {
  useCommentCreate,
  useCommentDelete,
  useCommentUpdate,
  useLikeCreate,
  useLikeDelete,
  useLikeFind,
} from "../../../../../../hooks";
import { ReactionPanel } from "../../../../../ReactionPanel";
import { formatDayLabel } from "../../../../../../utils";
import { textFieldStyles } from "../../../../../../pages/styles";

interface Props {
  comment: CommentResponseDto;
}

export function CommentLine({ comment }: Props) {
  const { user } = useAuth();

  console.log(comment.replies)

  const isAuthor = user?.id === comment.user.id;
  const isReply = Boolean(comment.parentCommentId);
  const replyCount = comment.replies?.length || 0;

  const { data: likes } = useLikeFind("comment", comment.id);
  const hasLiked = likes?.some((l) => l.userId === user?.id);

  const { mutateAsync: createLike } = useLikeCreate();
  const { mutateAsync: deleteLike } = useLikeDelete();
  const { mutateAsync: updateComment } = useCommentUpdate(comment.id);
  const { mutateAsync: deleteComment } = useCommentDelete();
  const { mutateAsync: createComment } = useCommentCreate();

  // Local state
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

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

    createComment(
      {
        userId: user.id,
        postId: comment.postId,
        parentCommentId: comment.id,
        content: replyText.trim(),
      },
      {
        onSuccess: () => {
          setReplyText("");
          setShowReplies(true); // auto-open replies
        },
      }
    );
  };

  const saveEdit = () => {
    if (!editValue.trim()) return;
    updateComment(
      { content: editValue },
      { onSuccess: () => setEditing(false) }
    );
  };

  const formattedDate = formatDayLabel(new Date(comment.createdAt));

  return (
    <Stack spacing={1} sx={{ mb: 1.5, pl: isReply ? 5 : 0 }}>
      {/* Comment bubble */}
      <Stack spacing={1} sx={{ p: 1.5, backgroundColor: "#1e1e1e", borderRadius: 1 }}>
        {/* Header */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={comment.user.avatarUrl || ""} sx={{ width: 28, height: 28 }} />

          <Stack flex={1}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography fontSize={13} color="white" fontWeight={500}>
                {comment.user.firstName} {comment.user.lastName}
              </Typography>
              <Typography fontSize={12} color="gray">
                @{comment.user.userName}
              </Typography>
              <Typography fontSize={11} color="gray" sx={{ ml: 0.5 }}>
                • {formattedDate}
              </Typography>
            </Stack>
          </Stack>

          {/* Author settings */}
          {!editing && isAuthor && (
            <>
              <IconButton
                size="small"
                sx={{ color: "gray", p: 0.5 }}
                onClick={(e) => setAnchor(e.currentTarget)}
              >
                <Settings sx={{ fontSize: 16 }} />
              </IconButton>

              <Popover
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                PaperProps={{
                  sx: {
                    backgroundColor: "#1e1e1e",
                    minWidth: 120,
                    border: "1px solid #444",
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setEditing(true);
                    setEditValue(comment.content);
                    setAnchor(null);
                  }}
                  sx={{ color: "white", fontSize: 13 }}
                >
                  <Edit sx={{ fontSize: 16, mr: 1 }} /> Edit
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    deleteComment(comment.id);
                    setAnchor(null);
                  }}
                  sx={{ color: "red", fontSize: 13 }}
                >
                  <Delete sx={{ fontSize: 16, mr: 1 }} /> Delete
                </MenuItem>
              </Popover>
            </>
          )}
        </Stack>

        {/* Content or edit mode */}
        {!editing ? (
          <Typography
            fontSize={14}
            color="white"
            sx={{ pl: 4, whiteSpace: "pre-wrap", lineHeight: 1.4 }}
          >
            {comment.content}
          </Typography>
        ) : (
          <Stack spacing={1} sx={{ pl: 4 }}>
            <Input
              fullWidth
              multiline
              minRows={2}
              disableUnderline
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              sx={{
                background: "#1e1e1e",
                color: "white",
                border: "1px solid #444",
                borderRadius: 1,
                p: 1,
              }}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setEditing(false)}
                sx={{ color: "white", borderColor: "#555" }}
              >
                Cancel
              </Button>
              <Button variant="contained" size="small" onClick={saveEdit}>
                Save
              </Button>
            </Stack>
          </Stack>
        )}

        {/* Actions */}
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          {/* Like */}
          <IconButton size="small" onClick={toggleLike} disabled={isAuthor} sx={{ p: 0.5 }}>
            <ThumbUp
              sx={{
                fontSize: 16,
                color: hasLiked ? "lightblue" : "white",
              }}
            />
          </IconButton>
          <Typography color={hasLiked ? "lightblue" : "white"} fontSize={12}>
            {likes?.length || 0}
          </Typography>

          {/* Chat bubble — toggles replies */}
          {!isReply && (
            <>
              <IconButton
                size="small"
                onClick={() => setShowReplies((s) => !s)}
                sx={{ p: 0.5 }}
              >
                <ChatBubble
                  sx={{
                    fontSize: 16,
                    color: replyCount > 0 ? "lightblue" : "white",
                  }}
                />
              </IconButton>

              <Typography
                fontSize={12}
                color={replyCount > 0 ? "lightblue" : "white"}
              >
                {replyCount}
              </Typography>
            </>
          )}

          <ReactionPanel
            smallIcon
            entityType="comment"
            entityId={comment.id}
            reactionEntries={comment.reactions}
            isSelf={isAuthor}
          />
        </Stack>
      </Stack>
      {showReplies && (
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              sx={textFieldStyles}
              fullWidth
            />
            <Button
              variant="outlined"
              size="small"
              onClick={submitReply}
              sx={{
                border: "1px solid #444",
                color: "white"
              }}
              disabled={!replyText.trim()}
            >
              Send
            </Button>
          </Stack>
          {comment.replies?.map((reply) => (
            <CommentLine key={reply.id} comment={reply} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
