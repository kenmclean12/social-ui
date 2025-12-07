import { Stack, Button, Typography } from "@mui/material";
import { useAuth } from "../../../../../../context";
import { useUserDelete } from "../../../../../../hooks";
import { UniversalDialog } from "../../../../../UniversalDialog";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteAccountDialog({ open, setOpen }: Props) {
  const { logout } = useAuth();
  const { mutateAsync: deleteUser, isPending } = useUserDelete();

  const handleDelete = async () => {
    try {
      await deleteUser();
      logout();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <UniversalDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Delete Account"
      footer={
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#ccc" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Confirm"}
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <Typography sx={{ color: "white" }}>
          This action is <strong style={{ color: "red" }}>permanent</strong>.
          All your data will be permanently deleted and cannot be recovered
          afterwards. Would you like to proceed?
        </Typography>
      </Stack>
    </UniversalDialog>
  );
}
