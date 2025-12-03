import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUserResetPassword } from "../../../../../hooks";
import type { PasswordResetDto } from "../../../../../types";

interface ResetPasswordProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ResetPassword({ open, setOpen }: ResetPasswordProps) {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const { mutateAsync: resetPassword } = useUserResetPassword();

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword) return;
    const dto: PasswordResetDto = { oldPassword, newPassword };
    try {
      await resetPassword(dto);
      setOpen(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
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
        Reset Password
        <IconButton onClick={() => setOpen(false)} sx={{ color: "red" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1} width="400px">
          <TextField
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
