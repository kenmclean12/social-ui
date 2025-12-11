import { useState } from "react";
import {
  Avatar,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  Box,
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
import { formatDayAndTime } from "../../../../../../utils";
import { textFieldStyles } from "../../../../../../pages/styles";
import { PopoverMenu, PopoverMenuItem } from "../../../../../PopoverMenu";
import { sendButtonStyles } from "../styles";
import { ProfileDialog } from "../../../../../Profile";
import {
  chatBubbleStyles,
  contentContainerStyles,
  contentTextStyles,
  firstToReplyTextStyles,
  noRepliesContainerStyles,
  repliesContainerStyles,
  settingsIconStyles,
  timestampStyles,
  userTextStyles,
} from "./styles";

interface Props {
  comment: CommentResponseDto;
  setCount?: React.Dispatch<React.SetStateAction<number>>;
  isReply?: boolean;
}

export function CommentLine({ comment, setCount, isReply }: Props) {
  const { user } = useAuth();
  const isAuthor = user?.id === comment.user.id;
  const replyCount = comment.replies?.length || 0;
  const [profileId, setProfileId] = useState<number | null>(null);
  const { data: likes } = useLikeFind("comment", comment.id);
  const hasLiked = likes?.some((l) => l.userId === user?.id);

  const { mutateAsync: createLike } = useLikeCreate();
  const { mutateAsync: deleteLike } = useLikeDelete();
  const { mutateAsync: updateComment } = useCommentUpdate(comment.id);
  const { mutateAsync: deleteComment } = useCommentDelete();
  const { mutateAsync: createComment } = useCommentCreate();

  const [editing, setEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(comment.content);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");

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
          setShowReplies(true);
          if (setCount) {
            setCount((prev) => prev + 1);
          }
        },
      }
    );
  };

  const getTotalCommentCount = (comment: CommentResponseDto): number => {
    let count = 1;
    if (comment.replies && comment.replies.length > 0) {
      for (const reply of comment.replies) {
        count += getTotalCommentCount(reply);
      }
    }
    return count;
  };

  const handleDelete = () => {
    deleteComment(comment.id, {
      onSuccess: () => {
        if (setCount) {
          const total = getTotalCommentCount(comment);
          setCount((prev) => prev - total);
        }
      },
    });
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

  return (
    <>
      <Stack sx={{ paddingInline: isReply ? 1.5 : 0, mb: 1 }}>
        <Stack
          sx={{
            ...contentContainerStyles,
            borderBottom: showReplies ? "none" : "1px solid #444",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              src={comment.user.avatarUrl || ""}
              sx={{ width: 25, height: 25 }}
            />
            <Stack flex={1} minWidth={0}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                minWidth={0}
              >
                <Typography
                  onClick={() => setProfileId(comment.user.id)}
                  sx={userTextStyles}
                >
                  {comment.user.firstName} {comment.user.lastName}
                </Typography>
                <Typography sx={timestampStyles}>
                  •{" "}
                  {comment.createdAt
                    ? formatDayAndTime(new Date(comment.createdAt))
                    : "n/a"}
                </Typography>
              </Stack>
            </Stack>
            {!editing && isAuthor && (
              <PopoverMenu trigger={<Settings sx={settingsIconStyles} />}>
                <PopoverMenuItem
                  label="Edit"
                  onClick={handleEditClick}
                  closeOnSelect
                />
                <PopoverMenuItem
                  label="Delete"
                  onClick={handleDelete}
                  closeOnSelect
                />
              </PopoverMenu>
            )}
          </Stack>
          {!editing ? (
            <Typography sx={contentTextStyles}>{comment.content}</Typography>
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
            <Stack
              direction="row"
              alignItems="center"
              mr={1}
              onClick={!isAuthor ? toggleLike : () => {}}
              sx={{ cursor: "pointer" }}
            >
              <ThumbUp
                sx={{
                  height: 15,
                  color: hasLiked ? "lightblue" : "white",
                }}
              />
              <Typography
                color={hasLiked ? "lightblue" : "white"}
                fontSize={13}
              >
                {likes?.length || 0}
              </Typography>
            </Stack>
            {!isReply && (
              <Stack
                direction="row"
                alignItems="center"
                onClick={() => setShowReplies((s) => !s)}
                sx={{ cursor: "pointer" }}
              >
                <ChatBubble
                  sx={{
                    height: 15,
                    color: replyCount > 0 ? "lightblue" : "white",
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
        <Divider sx={{ backgroundColor: "#444" }} />
        {showReplies && (
          <Stack
            spacing={1}
            border="1px solid #444"
            borderTop="none"
            mb={4}
            sx={{ backgroundColor: "#121212" }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              p={1.5}
              pb={0.25}
            >
              <TextField
                size="small"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                sx={{ ...textFieldStyles, backgroundColor: "black" }}
                inputProps={{ maxLength: 400 }}
                fullWidth
              />
              <Button
                variant="outlined"
                size="small"
                onClick={submitReply}
                sx={sendButtonStyles}
                disabled={!replyText.trim()}
              >
                Reply
              </Button>
            </Stack>
            <Stack sx={repliesContainerStyles}>
              {comment.replies && comment.replies.length > 0 ? (
                comment.replies?.map((reply) => (
                  <CommentLine
                    key={reply.id}
                    comment={reply}
                    isReply={true}
                    setCount={setCount}
                  />
                ))
              ) : (
                <Box sx={noRepliesContainerStyles}>
                  <ChatBubble sx={chatBubbleStyles} />
                  <Typography variant="body2" align="center">
                    No replies yet
                  </Typography>
                  <Typography
                    align="center"
                    variant="caption"
                    sx={firstToReplyTextStyles}
                  >
                    Be the first to reply
                  </Typography>
                </Box>
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
      {profileId && (
        <ProfileDialog
          open={!!profileId}
          userId={profileId}
          onClose={() => setProfileId(null)}
        />
      )}
    </>
  );
}
