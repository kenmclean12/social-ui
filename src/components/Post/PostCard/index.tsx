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
import { ThumbUp, ChatBubble, ArrowBack, MoreVert } from "@mui/icons-material";
import { type PostResponseDto } from "../../../types";
import { useAuth } from "../../../context";
import { CommentSection, DeletePostDialog, MediaSection } from "./components";
import { useLikeCreate, useLikeDelete, usePostUpdate } from "../../../hooks";
import { ReactionPanel } from "../../ReactionPanel";
import { commentSectionContainerStyles, paperStyles } from "./styles";
import { PopoverMenu, PopoverMenuItem } from "../../PopoverMenu";
import { cancelButtonStyles } from "../../../pages/Home/components/Messages/components/Sidebar/StartConversationDialog/styles";
import { textFieldStyles } from "../../../pages/styles";
import { ProfileDialog } from "../../Profile";

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
  const [editText, setEditText] = useState<string>(post.textContent || "");
  const { mutate: createLike } = useLikeCreate();
  const { mutate: removeLike } = useLikeDelete();
  const { mutate: updatePost } = usePostUpdate(post.id, user?.id as number);

  const hasLiked = useMemo(
    () => post.likes?.some((l) => l.userId === user?.id),
    [post.likes, user?.id]
  );
  const hasCommented = useMemo(
    () => post.comments?.some((c) => c.user?.id === (user?.id as number)),
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

  return (
    <>
      <Paper sx={{ ...paperStyles, height, width }}>
        <Slide direction="right" in={!showComments} mountOnEnter appear={false}>
          <Stack spacing={1} sx={{ height: "100%" }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flex={1}
                minWidth={0}
                onClick={() => setProfileOpen(true)}
                sx={{ cursor: "pointer" }}
              >
                <Avatar src={post.creator?.avatarUrl} />
                <Typography
                  color="white"
                  fontWeight="bold"
                  sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    flexShrink: 1,
                    minWidth: 0,
                  }}
                >
                  {post.creator
                    ? `${post.creator.firstName} ${post.creator.lastName}`
                    : "Unknown User"}
                </Typography>
              </Stack>
              {post.creator?.id === user?.id && (
                <PopoverMenu
                  trigger={
                    <IconButton>
                      <MoreVert sx={{ color: "white" }} />
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
            <Divider sx={{ backgroundColor: "#444" }} />
            <MediaSection url={post.contentUrl} height={400} />
            <Stack height="170px" p={1}>
              {editing ? (
                <>
                  <TextField
                    multiline
                    fullWidth
                    minRows={3}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    sx={textFieldStyles}
                  />
                  <Stack
                    direction="row"
                    spacing={1}
                    mt={1}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="outlined"
                      style={cancelButtonStyles}
                      onClick={() => {
                        setEditing(false);
                        setEditText(post.textContent ?? "");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleSaveEdit}
                      style={{
                        border: "1px solid lightblue",
                        color: "lightblue",
                      }}
                      disabled={editText === post.textContent}
                    >
                      Save
                    </Button>
                  </Stack>
                </>
              ) : (
                <Typography color="white" pt={1}>
                  {post.textContent}
                </Typography>
              )}
            </Stack>
            <Divider sx={{ backgroundColor: "#444" }} />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Stack direction="row" alignItems="center" spacing={1} mr={2}>
                <ThumbUp
                  onClick={handleToggleLike}
                  sx={{ color: hasLiked ? "lightblue" : "white" }}
                />
                <Typography sx={{ color: hasLiked ? "lightblue" : "white" }}>
                  {post.likes?.length || 0}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} mr={1}>
                <ChatBubble
                  onClick={() => setShowComments(true)}
                  sx={{ color: hasCommented ? "lightblue" : "white" }}
                />
                <Typography
                  sx={{ color: hasCommented ? "lightblue" : "white" }}
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
          <Stack sx={commentSectionContainerStyles}>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton onClick={() => setShowComments(false)}>
                <ArrowBack sx={{ color: "white" }} />
              </IconButton>
              <Typography color="white" fontWeight="bold">
                Comments ({post.comments?.length || 0})
              </Typography>
            </Stack>
            <Divider sx={{ backgroundColor: "#444", my: 1 }} />
            <CommentSection comments={post.comments} postId={post.id} />
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
