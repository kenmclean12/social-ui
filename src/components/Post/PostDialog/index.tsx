import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { usePostFindOne } from "../../../hooks";
import { PostCard } from "../PostCard";

interface PostDialogProps {
  open: boolean;
  postId: number | null;
  onClose: () => void;
}

export function PostDialog({ open, postId, onClose }: PostDialogProps) {
  const { data: post, isLoading } = usePostFindOne(postId as number);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "#1e1e1e",
          border: "1px solid #444",
          borderRadius: 2,
          color: "white",
          p: 1,
        },
      }}
    >
      <DialogContent>
        {isLoading && (
          <Typography align="center" p={3}>
            Loading post...
          </Typography>
        )}
        {!isLoading && post && (
          <Stack p={1}>
            <PostCard post={post} width="100%" />
          </Stack>
        )}
        {!isLoading && !post && (
          <Typography align="center" color="white" p={3}>
            Post not found.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
