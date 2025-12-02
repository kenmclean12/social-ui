import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Paper,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUserFindOne } from "../../../../hooks";
import { AvatarUpload, DescriptionSection, InfoSection } from "./components";
import { useAuth } from "../../../../context";
import { DeleteAccount } from "./components/DeleteAccount";

interface ProfileDialogProps {
  open: boolean;
  userId: number;
  onClose: () => void;
}

export function ProfileDialog({ open, userId, onClose }: ProfileDialogProps) {
  const { user: self } = useAuth();
  const { data: user, isLoading } = useUserFindOne(userId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    // implement your delete logic here
    console.log("Deleting account...");
    setConfirmDelete(false);
    onClose(); // close dialog after deletion
  };

  function formatNumber(num: number): string {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={undefined}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: "#121212", color: "#fff" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff",
            paddingBottom: 1,
          }}
        >
          Profile
          <IconButton onClick={onClose} sx={{ color: "red" }} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          {isLoading && <Typography sx={{ p: 2 }}>Loading...</Typography>}
          {user && (
            <Stack spacing={3} sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={3} height="150px">
                <AvatarUpload currentUrl={user.avatarUrl} isOwnUser={user.id === self?.id} />
                <InfoSection user={user} />
                <Stack spacing={1} alignItems="center" height="100%" marginLeft="auto">
                  <Paper
                    elevation={1}
                    sx={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100px",
                      p: 1,
                      textAlign: "center",
                      backgroundColor: "#1e1e1e",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: "#fff" }}>
                      Followers
                    </Typography>
                    <Typography variant="h6" sx={{ color: "lightblue" }}>
                      {formatNumber(user.followerCount)}
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={1}
                    sx={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100px",
                      p: 1,
                      textAlign: "center",
                      backgroundColor: "#1e1e1e",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: "#fff" }}>
                      Following
                    </Typography>
                    <Typography variant="h6" sx={{ color: "lightblue" }}>
                      {formatNumber(user.followingCount)}
                    </Typography>
                  </Paper>
                </Stack>
              </Stack>
              <DescriptionSection description={user.description || ""} isOwnUser={user.id === self?.id} />
              {user.id === self?.id && <DeleteAccount />}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
      {confirmDelete && (
        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete your account?</Typography>
            <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
              <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
              <Button color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
