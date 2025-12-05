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
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          bgcolor: "#1e1e1e",
          color: "white",
          border: "1px solid #444",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
        }}
      >
        Delete Account
        <IconButton onClick={() => setOpen(false)} sx={{ color: "red" }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ color: "white" }}>
        <Stack spacing={4} width="400px" mt={1}>
          <Typography sx={{ color: "#ddd" }}>
            This action is permanent. All data will be deleted.
          </Typography>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button sx={{ color: "#ccc" }} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{
                bgcolor: "#b00020",
                "&:hover": { bgcolor: "#d00028" },
              }}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
