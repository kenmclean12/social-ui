import { useState } from "react";
import {
  Avatar,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { ThumbUp, ChatBubble, Settings } from "@mui/icons-material";
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
import { PopoverMenu, PopoverMenuItem } from "../../../../../PopoverMenu";

interface Props {
  comment: CommentResponseDto;
  isReply?: boolean;
}

export function CommentLine({ comment, isReply }: Props) {
  const { user } = useAuth();

  const isAuthor = user?.id === comment.user.id;
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

  const handleEditClick = () => {
    setEditing(true);
    setEditValue(comment.content);
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
    <Stack sx={{ mb: 1.5, paddingInline: isReply ? 1 : 0 }}>
      {/* Comment bubble */}
      <Stack
        spacing={1}
        sx={{
          p: 1.5,
          backgroundColor: "black",
          border: `1px solid #444`,
          borderRadius: 1,
        }}
      >
        {/* Header */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            src={comment.user.avatarUrl || ""}
            sx={{ width: 28, height: 28 }}
          />

          <Stack flex={1} sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{ minWidth: 0 }}
            >
              {/* Full name */}
              <Typography
                fontSize={13}
                color="white"
                fontWeight={500}
                sx={{
                  maxWidth: "45%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {comment.user.firstName} {comment.user.lastName}
              </Typography>

              {/* @username */}
              <Typography
                fontSize={12}
                color="lightgrey"
                sx={{
                  maxWidth: "35%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                @{comment.user.userName}
              </Typography>

              {/* Date — never shrinks, never gets ellipsed */}
              <Typography
                fontSize={11}
                color="lightgrey"
                sx={{ ml: 0.5, flexShrink: 0 }}
              >
                • {formattedDate}
              </Typography>
            </Stack>
          </Stack>

          {!editing && isAuthor && (
            <PopoverMenu
              trigger={
                <Settings
                  sx={{
                    cursor: "pointer",
                    color: "white",
                    p: 0.5,
                    fontSize: 25,
                  }}
                />
              }
            >
              <PopoverMenuItem
                label="Edit"
                onClick={handleEditClick}
                closeOnSelect
              />
              <PopoverMenuItem
                label="Delete"
                onClick={() => deleteComment(comment.id)}
                closeOnSelect
              />
            </PopoverMenu>
          )}
        </Stack>
        {!editing ? (
          <Typography
            fontSize={14}
            color="white"
            sx={{ pl: 4, whiteSpace: "pre-wrap", lineHeight: 1.4 }}
          >
            {comment.content}
          </Typography>
        ) : (
          <Stack
            spacing={1}
            p={1}
            pt={1}
            border="1px solid #444"
            borderRadius={1}
          >
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              sx={textFieldStyles}
            />
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1.5}
              pb={0.5}
            >
              <Button
                size="small"
                onClick={() => setEditing(false)}
                sx={{ color: "white", borderColor: "#555" }}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={saveEdit}
                sx={{ border: "1px solid lightblue", color: "lightblue" }}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        )}
        <Stack direction="row" justifyContent="flex-end">
          <Stack direction="row" alignItems="center" mr={1}>
            <ThumbUp
              onClick={isAuthor ? toggleLike : () => {}}
              sx={{
                height: 15,
                color: hasLiked ? "lightblue" : "white",
                cursor: "pointer",
              }}
            />
            <Typography color={hasLiked ? "lightblue" : "white"} fontSize={13}>
              {likes?.length || 0}
            </Typography>
          </Stack>
          {!isReply && (
            <Stack direction="row" alignItems="center">
              <ChatBubble
                onClick={() => setShowReplies((s) => !s)}
                sx={{
                  height: 15,
                  color: replyCount > 0 ? "lightblue" : "white",
                  cursor: "pointer",
                }}
              />
              <Typography
                fontSize={13}
                color={replyCount > 0 ? "lightblue" : "white"}
              >
                {replyCount}
              </Typography>
            </Stack>
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
        <Stack spacing={1} border="1px solid #444" borderTop="none">
          <Stack direction="row" spacing={1} p={1.5} pb={0.5}>
            <TextField
              size="small"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              sx={textFieldStyles}
              inputProps={{ maxLength: 400 }}
              fullWidth
            />
            <Button
              variant="outlined"
              size="small"
              onClick={submitReply}
              sx={{
                height: "37.5px",
                border: "1px solid lightblue",
                color: "lightblue",
              }}
              disabled={!replyText.trim()}
            >
              Send
            </Button>
          </Stack>
          <Divider sx={{ backgroundColor: "#444" }} />
          <Stack pt={0.5} maxHeight="300px" sx={{ overflowY: "auto" }}>
            {comment.replies?.map((reply) => (
              <CommentLine key={reply.id} comment={reply} isReply={true} />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
