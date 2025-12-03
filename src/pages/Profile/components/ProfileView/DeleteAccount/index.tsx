import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../../../context";
import { useUserDelete } from "../../../../../hooks";
import { Close } from "@mui/icons-material";

interface DeleteAccountProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteAccount({ open, setOpen }: DeleteAccountProps) {
  const { logout } = useAuth();
  const { mutateAsync: deleteUser } = useUserDelete();

  const handleDelete = async () => {
    try {
      await deleteUser();
      logout();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Delete Account
        <IconButton onClick={() => setOpen(false)} sx={{ color: "red" }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} width="400px" mt={1}>
          <Typography>
            This action is permanent. All data will be deleted.
          </Typography>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
