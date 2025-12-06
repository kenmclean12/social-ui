import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
      PaperProps={{
        sx: {
          backgroundColor: "#090909",
          border: "1px solid #333",
          color: "white",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          paddingY: 1.5,
          borderBottom: "1px solid #222",
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Post</Typography>
        <IconButton onClick={onClose} sx={{ marginLeft: "auto", color: "red" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
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
