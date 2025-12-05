import { useMemo, useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  Avatar,
  IconButton,
  MenuItem,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  Divider,
} from "@mui/material";
import { ThumbUp, ChatBubble, Edit, Delete } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import { type PostResponseDto } from "../../../types";
import {
  useCommentFindByPost,
  useLikeCreate,
  useLikeDelete,
  useLikeFind,
  useUserFindOne,
  usePostUpdate,
  usePostDelete,
} from "../../../hooks";
import { useAuth } from "../../../context";
import { CommentSection, MediaSection, ReactionPanel } from "./components";

interface PostProps {
  post: PostResponseDto;
  width?: string | number;
  height?: string | number;
}

export function PostCard({ post, width = "100%", height = "auto" }: PostProps) {
  const { user } = useAuth();
  const [hover, setHover] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(post.textContent);
  const [openDelete, setOpenDelete] = useState(false);

  const { mutateAsync: updatePost, isPending: updating } = usePostUpdate(
    post.id,
    user?.id as number
  );
  const { mutateAsync: deletePost, isPending: deleting } = usePostDelete(
    post.id,
    user?.id as number
  );

  const { data: creator } = useUserFindOne(post.creatorId);
  const { data: likes } = useLikeFind("post", post.id);
  const { data: comments } = useCommentFindByPost(post.id);
  const { mutate: createLike } = useLikeCreate();
  const { mutate: removeLike } = useLikeDelete();

  const hasLiked = useMemo(
    () => likes?.some((l) => l.userId === user?.id),
    [likes, user?.id]
  );
  const hasCommented = useMemo(
    () => comments?.some((c) => c.user.id === user?.id),
    [comments, user?.id]
  );
  const isOwner = user?.id === post.creatorId;

  const handleToggleLike = () => {
    if (user?.id === post.creatorId) return;
    if (!hasLiked) createLike({ userId: user?.id as number, postId: post.id });
    else {
      const like = likes?.find((l) => l.userId === user?.id);
      if (like) removeLike(like.id);
    }
  };

  const handleUpdate = async () => {
    await updatePost({ textContent: editValue });
    setEditing(false);
  };

  const handleDelete = async () => {
    await deletePost();
    setOpenDelete(false);
  };

  return (
    <Paper
      sx={{
        width,
        height,
        maxHeight: 600,
        p: 2,
        backgroundColor: "#1e1e1e",
        border: "1px solid #444",
        borderRadius: 2,
        position: "relative",
        transition: "0.2s",
        "&:hover": { boxShadow: hover ? "0 0 15px lightblue" : "none" },
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isOwner && (
        <>
          <IconButton
            sx={{ color: "lightblue", position: "absolute", top: 8, right: 8 }}
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <SettingsIcon />
          </IconButton>

          <Popover
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                backgroundColor: "#1e1e1e",
                minWidth: 200,
                padding: "5px 0",
                border: "1px solid #444",
              },
            }}
          >
            <Stack spacing={1}>
              <MenuItem
                onClick={() => {
                  setEditing(true);
                  setEditValue(post.textContent);
                  setMenuAnchor(null);
                }}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "white",
                }}
              >
                Update
                <Edit sx={{ color: "lightblue", height: 20 }} />
              </MenuItem>

              <MenuItem
                onClick={() => {
                  setOpenDelete(true);
                  setMenuAnchor(null);
                }}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "white",
                }}
              >
                Delete
                <Delete sx={{ color: "red", height: 20 }} />
              </MenuItem>
            </Stack>
          </Popover>
        </>
      )}

      <Stack spacing={1}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={creator?.avatarUrl} />
          <Typography color="white" fontWeight="bold">
            {creator
              ? `${creator.firstName} ${creator.lastName}`
              : "Unknown User"}
          </Typography>
        </Stack>
        <Divider sx={{ backgroundColor: "#444" }} />
        <MediaSection url={post.contentUrl} height={300} />
        <Stack maxHeight="200px" sx={{ overflowY: "auto" }} p={1}>
          {!editing && (
            <Typography color="white">{post.textContent || ""}</Typography>
          )}
          {editing && (
            <Stack spacing={1} p={1} pt={1.5}>
              <Input
                fullWidth
                disableUnderline
                multiline
                minRows={3}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                sx={{
                  background: "#2a2a2a",
                  color: "white",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  border: "1px solid #444",
                }}
              />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={1}
                width="100%"
                pt={1}
              >
                <Button
                  variant="outlined"
                  onClick={() => setEditing(false)}
                  sx={{ color: "white", borderColor: "#555" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  disabled={updating}
                  onClick={handleUpdate}
                >
                  {updating ? "Saving..." : "Save"}
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
        <Divider sx={{ backgroundColor: "#444" }} />
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Stack direction="row" alignItems="center" sx={{ gap: 0.2 }}>
            <IconButton onClick={handleToggleLike}>
              <ThumbUp sx={{ color: hasLiked ? "lightblue" : "white" }} />
            </IconButton>
            <Typography sx={{ color: hasLiked ? "lightblue" : "white" }}>
              {likes ? likes.length : 0}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" sx={{ gap: 0.2 }}>
            <IconButton onClick={() => setShowComments((v) => !v)}>
              <ChatBubble
                sx={{ color: hasCommented ? "lightblue" : "white" }}
              />
            </IconButton>
            <Typography sx={{ color: hasCommented ? "lightblue" : "white" }}>
              {comments ? comments.length : 0}
            </Typography>
          </Stack>

          <ReactionPanel
            entityType="post"
            entityId={post.id}
            isSelf={isOwner}
          />
        </Stack>
        {showComments && (
          <CommentSection comments={comments} postId={post.id} />
        )}
      </Stack>
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#1e1e1e",
            color: "white",
            border: "1px solid #444",
          },
        }}
      >
        <DialogTitle>Delete Post?</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography>This action cannot be undone. Are you sure?</Typography>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => setOpenDelete(false)}
                sx={{ color: "white", borderColor: "#555" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={deleting}
                onClick={handleDelete}
                sx={{ backgroundColor: "red" }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
