import React, { useState } from "react";
import { Stack, Button, Box, TextField } from "@mui/material";
import { useUserResetPassword } from "../../../../../../hooks";
import type { PasswordResetDto } from "../../../../../../types";
import { UniversalDialog } from "../../../../../UniversalDialog";
import { textFieldStyles } from "../../../../../../pages/styles";
import { buttonStyles } from "./styles";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ResetPasswordDialog({ open, setOpen }: Props) {
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
    <UniversalDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Reset Password"
      footer={
        <Box width="100%">
          <Button
            variant="outlined"
            onClick={handleSubmit}
            disabled={isPending}
            sx={buttonStyles}
            fullWidth
          >
            {isPending ? "Resetting..." : "Submit"}
          </Button>
        </Box>
      }
    >
      <Stack spacing={2}>
        <TextField
          type="password"
          placeholder="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          sx={{
            ...textFieldStyles,
            "& .MuiInputBase-input": {
              height: "10px",
              color: "white",
            },
          }}
        />
        <TextField
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          sx={{
            ...textFieldStyles,
            "& .MuiInputBase-input": {
              height: "10px",
              color: "white",
            },
          }}
        />
      </Stack>
    </UniversalDialog>
  );
}
