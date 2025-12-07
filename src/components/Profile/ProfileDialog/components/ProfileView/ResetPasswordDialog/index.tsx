import React, { useState } from "react";
import { Stack, Button, Input, Box } from "@mui/material";
import { useUserResetPassword } from "../../../../../../hooks";
import type { PasswordResetDto } from "../../../../../../types";
import { UniversalDialog } from "../../../../../UniversalDialog";

interface ResetPasswordProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ResetPasswordDialog({ open, setOpen }: ResetPasswordProps) {
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
      }
    >
      <Stack spacing={2}>
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
      </Stack>
    </UniversalDialog>
  );
}
