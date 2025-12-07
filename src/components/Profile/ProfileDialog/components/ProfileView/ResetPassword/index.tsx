import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
  Input,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUserResetPassword } from "../../../../../../hooks";
import type { PasswordResetDto } from "../../../../../../types";

interface ResetPasswordProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ResetPassword({ open, setOpen }: ResetPasswordProps) {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const { mutateAsync: resetPassword, isPending } = useUserResetPassword();

  const handleClose = () => {
    setOpen(false);
    setOldPassword("");
    setNewPassword("");
  };

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword) return;

    const dto: PasswordResetDto = { oldPassword, newPassword };
    try {
      await resetPassword(dto);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        Reset Password
        <CloseIcon
          onClick={handleClose}
          sx={{ marginLeft: "auto", color: "red", cursor: "pointer" }}
        />
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Input
            type="password"
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            disableUnderline
            sx={{
              height: "40px",
              background: "#1e1e1e",
              color: "white",
              px: 1.5,
              py: 1,
              borderRadius: 1,
              border: "1px solid #444",
            }}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            disableUnderline
            sx={{
              height: "40px",
              background: "#1e1e1e",
              color: "white",
              px: 1.5,
              py: 1,
              borderRadius: 1,
              border: "1px solid #444",
            }}
          />
          <Box pt={1} width="100%">
            <Button
              variant="outlined"
              onClick={handleSubmit}
              disabled={isPending}
              sx={{
                border: "1px solid #444",
                color: "lightblue",
                backgroundColor: "black",
              }}
              fullWidth
            >
              {isPending ? "Resetting..." : "Submit"}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
