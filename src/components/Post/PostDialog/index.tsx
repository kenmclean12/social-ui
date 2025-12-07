import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { usePostFindOne } from "../../../hooks";
import { PostCard } from "../PostCard";
import DialogHeader from "../../DialogHeader";

interface Props {
  open: boolean;
  postId: number | null;
  onClose: () => void;
}

export function PostDialog({ open, postId, onClose }: Props) {
  const { data: post, isLoading } = usePostFindOne(postId as number);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "black",
          border: "1px solid #444",
          color: "white",
          borderRadius: 2,
        },
      }}
    >
      <DialogHeader title="Post" onClose={onClose} />
      <DialogContent sx={{ padding: 2 }}>
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
