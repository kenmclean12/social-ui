import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Stack, Typography, Button, IconButton } from "@mui/material";
import { useUserDelete } from "../../../../../../../hooks";
import { useAuth } from "../../../../../../../context";
import { Close } from "@mui/icons-material";

export function DeleteAccount() {
  const { logout } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { mutateAsync: deleteUser } = useUserDelete();

  const handleDelete = async () => {
    try {
      await deleteUser();
      setConfirmDelete(false);
      logout();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <>
      <Stack mt={2} alignItems="center">
        <Button
          variant="contained"
          color="error"
          onClick={() => setConfirmDelete(true)}
        >
          Delete Account
        </Button>
      </Stack>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Confirm Account Deletion
          <IconButton onClick={() => setConfirmDelete(false)} sx={{ color: "red" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
            <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
