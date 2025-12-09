import { Stack, Button, Typography } from "@mui/material";
import { usePostDelete } from "../../../../../hooks";
import { UniversalDialog } from "../../../../UniversalDialog";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postId: number;
  userId: number;
  onDeleted?: () => void;
}

export function DeletePostDialog({
  open,
  setOpen,
  postId,
  userId,
  onDeleted,
}: Props) {
  const { mutateAsync: deletePost } = usePostDelete(postId, userId);

  const handleDelete = async () => {
    await deletePost();
    setOpen(false);
    onDeleted?.();
  };

  return (
    <UniversalDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Delete Post"
      footer={
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#ccc" }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Confirm
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <Typography sx={{ color: "white" }}>
          This action is <strong style={{ color: "red" }}>permanent</strong>.
          The post will be permanently deleted and cannot be recovered. Do you
          want to continue?
        </Typography>
      </Stack>
    </UniversalDialog>
  );
}
