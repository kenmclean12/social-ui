import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
  IconButton,
  Input,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUserResetPassword } from "../../../../../hooks";
import type { PasswordResetDto } from "../../../../../types";

interface ResetPasswordProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ResetPassword({ open, setOpen }: ResetPasswordProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
        Reset Password
        <IconButton onClick={() => setOpen(false)} sx={{ color: "red" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ color: "white" }}>
        <Stack mt={1} width="400px">
          <Input
            placeholder="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{
              padding: 0.5,
              paddingInline: 1,
              color: "white",
              bgcolor: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: 1,
              height: 38,
            }}
            disableUnderline
            fullWidth
          />
          <Input
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            sx={{
              mt: 2,
              padding: 0.5,
              paddingInline: 1,
              color: "white",
              bgcolor: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: 1,
              height: 38,
            }}
            disableUnderline
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button onClick={() => setOpen(false)} sx={{ color: "#ccc" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                bgcolor: "lightblue",
                color: "black",
                "&:hover": { bgcolor: "#9fd8ff" },
              }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
