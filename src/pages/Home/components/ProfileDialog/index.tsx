import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Avatar,
  Paper,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUserFindOne } from "../../../../hooks";

interface ProfileDialogProps {
  open: boolean;
  userId: number;
  onClose: () => void;
}

const longString = "vable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.vable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.vable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.vable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.vable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.vable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.vable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.vable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."

export function ProfileDialog({ open, userId, onClose }: ProfileDialogProps) {
  const { data: user, isLoading } = useUserFindOne(userId);

  const lightBlue = "#4fc3f7"; // your accent color
  const darkBg = "#121212";

  return (
    <Dialog
      open={open}
      onClose={undefined} // disable backdrop/escape closing
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkBg,
          color: "#fff",
        },
      }}
    >
      {/* Title with only red close icon */}
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
            {/* Main row: Avatar | Info | Followers */}
            <Stack direction="row" spacing={3} alignItems="flex-start">
              {/* Avatar */}
              <Avatar src={user.avatarUrl} sx={{ width: 80, height: 80 }} />

              {/* User Info */}
              <Stack spacing={1} flex={1}>
                <Typography variant="h6" sx={{ color: lightBlue }}>
                  {user.userName}
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">
                    <strong style={{ color: "#fff" }}>Name: </strong>
                    <span style={{ color: lightBlue }}>
                      {user.firstName} {user.lastName}
                    </span>
                  </Typography>
                  <Typography variant="body2">
                    <strong style={{ color: "#fff" }}>Email: </strong>
                    <span style={{ color: lightBlue }}>{user.email}</span>
                  </Typography>
                  <Typography variant="body2">
                    <strong style={{ color: "#fff" }}>Age: </strong>
                    <span style={{ color: lightBlue }}>{user.age || "N/A"}</span>
                  </Typography>
                  <Typography variant="body2">
                    <strong style={{ color: "#fff" }}>Phone: </strong>
                    <span style={{ color: lightBlue }}>{user.phoneNumber || "N/A"}</span>
                  </Typography>
                </Stack>
              </Stack>

              {/* Followers/Following counts */}
              <Stack spacing={1} alignItems="center">
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    textAlign: "center",
                    width: 80,
                    backgroundColor: "#1e1e1e",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#fff" }}>
                    Followers
                  </Typography>
                  <Typography variant="h6" sx={{ color: lightBlue }}>
                    {user.followerCount}
                  </Typography>
                </Paper>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    textAlign: "center",
                    width: 80,
                    backgroundColor: "#1e1e1e",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#fff" }}>
                    Following
                  </Typography>
                  <Typography variant="h6" sx={{ color: lightBlue }}>
                    {user.followingCount}
                  </Typography>
                </Paper>
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: "#333" }} />

            <Paper elevation={1} sx={{ maxHeight: "150px", p: 2, backgroundColor: "#1e1e1e", overflowY: "auto" }}>
              <Typography>
                <strong style={{ color: "#fff" }}>Description: </strong>
                <span style={{ color: lightBlue }}>{user.description || longString}</span>
              </Typography>
            </Paper>

            <Divider sx={{ borderColor: "#333" }} />
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
