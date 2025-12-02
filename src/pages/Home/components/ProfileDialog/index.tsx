import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";
import { useUserFindOne } from "../../../../hooks";

interface ProfileDialogProps {
  open: boolean;
  userId: number;
  onClose: () => void;
}

export function ProfileDialog({ open, userId, onClose }: ProfileDialogProps) {
  const { data: user, isLoading } = useUserFindOne(userId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Profile</DialogTitle>
      <DialogContent>
        {isLoading && <Typography>Loading...</Typography>}
        {user && (
          <Stack spacing={2}>
            <Avatar
              src={user.avatarUrl}
              sx={{ width: 80, height: 80 }}
            />
            <Typography>
              <strong>Username:</strong> {user.userName}
            </Typography>
            <Typography>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </Typography>
            <Typography>
              <strong>Age:</strong> {user.age}
            </Typography>
            {user.phoneNumber && (
              <Typography>
                <strong>Phone:</strong> {user.phoneNumber}
              </Typography>
            )}
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            {user.description && (
              <Typography>
                <strong>Description:</strong> {user.description}
              </Typography>
            )}
            <Typography>
              <strong>Followers:</strong> {user.followerCount} | <strong>Following:</strong> {user.followingCount}
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
