import { useMemo, useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Slide,
  TextField,
  Button,
} from "@mui/material";
import {
  ThumbUp,
  ChatBubble,
  ArrowBack,
  ArrowUpward,
  ArrowDownward,
  Settings,
} from "@mui/icons-material";
import { type PostResponseDto } from "../../../types";
import { useAuth } from "../../../context";
import { CommentSection, DeletePostDialog, MediaSection } from "./components";
import { useLikeCreate, useLikeDelete, usePostUpdate } from "../../../hooks";
import { ReactionPanel } from "../../ReactionPanel";
import { styles } from "./styles";
import { PopoverMenu, PopoverMenuItem } from "../../PopoverMenu";
import { ProfileDialog } from "../../Profile";
import { textFieldStyles } from "../../../pages/styles";
import { formatDayAndTime, formatDayLabel } from "../../../utils";

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
  const [editing, setEditing] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [post, setPost] = useState<PostResponseDto>(initialPost);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [editText, setEditText] = useState<string>(post.textContent || "");

  const { mutate: createLike } = useLikeCreate();
  const { mutate: removeLike } = useLikeDelete();
  const { mutate: updatePost } = usePostUpdate(post.id, user?.id as number);

  const hasLiked = useMemo(
    () => post.likes?.some((l) => l.userId === user?.id),
    [post.likes, user?.id]
  );
  const hasCommented = useMemo(
    () => post.comments?.some((c) => c.user?.id === user?.id),
    [post.comments, user?.id]
  );

  const handleToggleLike = () => {
    if (!user) return;
    if (!hasLiked) {
      createLike(
        { userId: user.id, postId: post.id },
        {
          onSuccess: (like) =>
            setPost((prev) => ({
              ...prev,
              likes: [...(prev.likes ?? []), like],
            })),
        }
      );
    } else {
      const like = post.likes?.find((l) => l.userId === user?.id);
      if (!like) return;
      removeLike(like.id, {
        onSuccess: () =>
          setPost((prev) => ({
            ...prev,
            likes: prev.likes?.filter((l) => l.id !== like.id),
          })),
      });
    }
  };

  const handleSaveEdit = () => {
    updatePost(
      { textContent: editText },
      {
        onSuccess: (updated) => {
          setPost(updated);
          setEditing(false);
        },
      }
    );
  };

  const showTextSection = editing || Boolean(post.textContent);

  return (
    <>
      <Paper sx={{ ...styles.paper, height, width }}>
        <Slide direction="right" in={!showComments} mountOnEnter appear={false}>
          <Stack spacing={1} sx={{ height: "100%" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack
                onClick={() => setProfileOpen(true)}
                sx={styles.headerContainer}
              >
                <Avatar src={post.creator?.avatarUrl} />
                <Stack minWidth={0} spacing={0.25}>
                  <Typography sx={styles.headerText}>
                    {post.creator
                      ? `${post.creator.firstName} ${post.creator.lastName}`
                      : "Unknown User"}
                  </Typography>
                  {post.createdAt && (
                    <Typography sx={styles.timestampText}>
                      {formatDayAndTime(new Date(post.createdAt))}
                    </Typography>
                  )}
                </Stack>
              </Stack>
              {post.creator?.id === user?.id && (
                <PopoverMenu
                  trigger={
                    <IconButton>
                      <Settings sx={{ color: "white" }} />
                    </IconButton>
                  }
                >
                  <PopoverMenuItem
                    label="Edit Post"
                    onClick={() => setEditing(true)}
                    closeOnSelect
                  />
                  <PopoverMenuItem
                    label="Delete Post"
                    onClick={() => setDeleteOpen(true)}
                    closeOnSelect
                  />
                </PopoverMenu>
              )}
            </Stack>
            <Divider sx={styles.divider} />
            <MediaSection
              url={post.contentUrl}
              height={
                collapsed ? "100%" : post.textContent && !editing ? 400 : "100%"
              }
            />
            {post.textContent && !editing && (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ cursor: "pointer", py: 0.5 }}
                onClick={() => setCollapsed((prev) => !prev)}
              >
                <Typography sx={{ color: "white", fontSize: "13px", mr: 0.5 }}>
                  {collapsed ? "Show text" : "Hide text"}
                </Typography>
                {collapsed ? (
                  <ArrowUpward sx={{ color: "white", fontSize: 18 }} />
                ) : (
                  <ArrowDownward sx={{ color: "white", fontSize: 18 }} />
                )}
              </Stack>
            )}
            {((!collapsed && showTextSection) || (collapsed && editing)) && (
              <Stack
                sx={{
                  height: editing ? 330 : "50%",
                  maxHeight: editing ? 380 : 200,
                  overflowY: "auto",
                }}
              >
                {editing ? (
                  <>
                    <TextField
                      multiline
                      fullWidth
                      minRows={3}
                      value={editText}
                      inputProps={{ maxLength: 500 }}
                      onChange={(e) => setEditText(e.target.value)}
                      sx={textFieldStyles}
                      slotProps={{
                        input: {
                          sx: {
                            maxHeight: 120,
                            overflowY: "auto",
                          },
                        },
                      }}
                    />
                    <Stack sx={styles.editActionsStack}>
                      <Button
                        variant="outlined"
                        sx={styles.cancelButton}
                        onClick={() => {
                          setEditing(false);
                          setEditText(post.textContent ?? "");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outlined"
                        sx={styles.saveButton}
                        onClick={handleSaveEdit}
                        disabled={editText === post.textContent}
                      >
                        Save
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <Typography sx={{ color: "white" }}>
                    {post.textContent}
                  </Typography>
                )}
              </Stack>
            )}

            <Divider sx={styles.divider} />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                mr={2}
                sx={{ cursor: "pointer" }}
              >
                <ThumbUp
                  onClick={handleToggleLike}
                  sx={hasLiked ? styles.iconActive : styles.iconInactive}
                />
                <Typography
                  sx={hasLiked ? styles.iconActive : styles.iconInactive}
                >
                  {post.likes?.length || 0}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                mr={1}
                sx={{ cursor: "pointer" }}
              >
                <ChatBubble
                  onClick={() => setShowComments(true)}
                  sx={hasCommented ? styles.iconActive : styles.iconInactive}
                />
                <Typography
                  sx={hasCommented ? styles.iconActive : styles.iconInactive}
                >
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
          <Stack sx={styles.commentContainer}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ cursor: "pointer" }}
            >
              <IconButton onClick={() => setShowComments(false)}>
                <ArrowBack sx={{ color: "white" }} />
              </IconButton>
              <Typography color="white" fontWeight="bold">
                Comments ({post.comments?.length || 0})
              </Typography>
            </Stack>
            <Divider sx={{ backgroundColor: "#444", my: 1 }} />
            <CommentSection postId={post.id} />
          </Stack>
        </Slide>
      </Paper>
      <DeletePostDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        postId={post.id}
        userId={user?.id as number}
        onDeleted={() => console.log("Post deleted or refresh state")}
      />
      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        userId={post.creator.id}
      />
    </>
  );
}
