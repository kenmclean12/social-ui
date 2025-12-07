import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../../../../context";
import { useUserDelete } from "../../../../../../hooks";
import CloseIcon from "@mui/icons-material/Close";

interface DeleteAccountProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteAccount({ open, setOpen }: DeleteAccountProps) {
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
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "black",
          color: "white",
          border: "1px solid #444",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        Delete Account
        <CloseIcon
          onClick={() => setOpen(false)}
          sx={{ marginLeft: "auto", color: "red", cursor: "pointer" }}
        />
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <Typography sx={{ color: "#ddd", lineHeight: 1.5 }}>
            This action is <strong>permanent</strong>. All your data will be
            permanently deleted and cannot be recovered.
          </Typography>
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
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
