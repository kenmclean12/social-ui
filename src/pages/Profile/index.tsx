import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Button,
  Popover,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import { useAuth } from "../../context";
import { FollowListView, ProfileView } from "./components";
import {
  useFollowCreate,
  useFollowGetFollowing,
  useFollowRemove,
  useUserFindOne,
} from "../../hooks";
import { ResetPassword } from "./components/ProfileView/ResetPassword";
import { DeleteAccount } from "./components/ProfileView/DeleteAccount";
import { Check, PersonAdd } from "@mui/icons-material";

interface StackItem {
  type: "profile" | "followList";
  userId: number;
  listType?: "followers" | "following";
}

interface ProfileDialogProps {
  open: boolean;
  userId: number;
  onClose: () => void;
}

export function ProfileDialog({ open, userId, onClose }: ProfileDialogProps) {
  const { user: self } = useAuth();
  const [resetOpen, setResetOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [stack, setStack] = useState<StackItem[]>([
    { type: "profile", userId },
  ]);
  const top = stack[stack.length - 1];

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const { data: followingList } = useFollowGetFollowing(self?.id || 0);
  const { data: user } = useUserFindOne(userId);
  const followCreate = useFollowCreate();
  const followRemove = useFollowRemove();
  const followRecord = followingList?.find((f) => f.following.id === userId);
  const isFollowing = !!followRecord;

  const handleFollowToggle = () => {
    if (!user || !self) return;
    if (isFollowing) followRemove.mutate(followRecord?.id as number);
    else followCreate.mutate({ followerId: self.id, followingId: user.id });
  };

  const push = (item: StackItem) => setStack((prev) => [...prev, item]);
  const pop = () =>
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  if (!top) return null;

  const isOwnProfile = top.type === "profile" && top.userId === self?.id;

  const title =
    top.type === "profile"
      ? "Profile"
      : top.listType === "followers"
      ? "Followers"
      : "Following";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minWidth: "730px", backgroundColor: "#121212", color: "#fff" },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {stack.length > 1 && (
          <IconButton onClick={pop} sx={{ color: "lightblue" }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Stack direction="row" alignItems="center" spacing={2}>
          <span>{title}</span>
          {top.type === "profile" && !isOwnProfile && (
            <Button variant={"outlined"} endIcon={isFollowing ? <Check /> : <PersonAdd />} onClick={handleFollowToggle}>
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{ marginLeft: "auto", alignItems: "center" }}
        >
          {isOwnProfile && (
            <>
              <IconButton
                sx={{ color: "lightblue" }}
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <SettingsIcon />
              </IconButton>
              <Popover
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    backgroundColor: "black",
                    minWidth: 150,
                    padding: "10px",
                  },
                }}
              >
                <Stack p={1} spacing={1}>
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={() => {
                      setResetOpen(true);
                      setMenuAnchor(null);
                    }}
                  >
                    Reset Password
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setDeleteOpen(true);
                      setMenuAnchor(null);
                    }}
                  >
                    Delete Account
                  </Button>
                </Stack>
              </Popover>
            </>
          )}
          <IconButton onClick={onClose} sx={{ color: "red" }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ padding: 0 }}>
        {top.type === "profile" ? (
          <ProfileView
            userId={top.userId}
            self={self}
            onClickFollowers={() =>
              push({
                type: "followList",
                userId: top.userId,
                listType: "followers",
              })
            }
            onClickFollowing={() =>
              push({
                type: "followList",
                userId: top.userId,
                listType: "following",
              })
            }
          />
        ) : (
          <FollowListView
            userId={top.userId}
            listType={top.listType!}
            onClickUser={(id: number) => push({ type: "profile", userId: id })}
          />
        )}
      </DialogContent>
      <ResetPassword open={resetOpen} setOpen={setResetOpen} />
      <DeleteAccount open={deleteOpen} setOpen={setDeleteOpen} />
    </Dialog>
  );
}
