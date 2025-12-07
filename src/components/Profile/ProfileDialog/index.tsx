import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Button,
  Popover,
  MenuItem,
} from "@mui/material";
import {
  Check,
  Delete,
  Password,
  PersonAdd,
  ArrowBack,
  Close,
  Settings,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../../context";
import { FollowListView, ProfileView } from "./components";
import {
  useFollowCreate,
  useFollowGetFollowing,
  useFollowRemove,
  useUserFindOne,
} from "../../../hooks";
import { ResetPasswordDialog } from "./components/ProfileView/ResetPasswordDialog";
import { DeleteAccountDialog } from "./components/ProfileView/DeleteAccountDialog";

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
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [stack, setStack] = useState<StackItem[]>([
    { type: "profile", userId },
  ]);
  const top = stack[stack.length - 1];

  const { data: followingListRaw, error } = useFollowGetFollowing(
    self?.id as number
  );
  const followingList = error ? [] : followingListRaw ?? [];
  const { data: user } = useUserFindOne(top.userId);
  const followRecord = followingList?.find(
    (f) => f.following.id === top.userId
  );
  const isFollowing = !!followRecord;
  const followCreate = useFollowCreate(self?.id as number);
  const followRemove = useFollowRemove(self?.id as number);

  const push = (item: StackItem) => setStack((prev) => [...prev, item]);
  const pop = () =>
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  const isOwnProfile = top.type === "profile" && top.userId === self?.id;

  const getTitle = (item: StackItem) => {
    if (item.type === "profile") return "Profile";
    if (item.listType === "followers") return "Followers";
    return "Following";
  };

  const handleFollowToggle = () => {
    if (!user || !self) return;
    if (isFollowing)
      followRemove.mutate({
        id: followRecord?.id as number,
        followingId: user.id,
      });
    else followCreate.mutate({ followerId: self.id, followingId: user.id });
  };

  const title = getTitle(top);

  if (!top) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: "90vh",
          backgroundColor: "black",
          color: "#fff",
          border: "1px solid #444",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {stack.length > 1 && (
          <IconButton onClick={pop} sx={{ color: "lightblue" }}>
            <ArrowBack />
          </IconButton>
        )}
        {title}
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ marginLeft: "auto", alignItems: "center" }}
        >
          {isOwnProfile && (
            <>
              <IconButton
                sx={{ color: "white" }}
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <Settings />
              </IconButton>
              <Popover
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    backgroundColor: "#1e1e1e",
                    minWidth: 200,
                    padding: "5px 0",
                    border: "1px solid #444",
                  },
                }}
              >
                <Stack spacing={1}>
                  <MenuItem
                    onClick={() => {
                      setResetOpen(true);
                      setMenuAnchor(null);
                    }}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "white",
                    }}
                  >
                    Reset Password
                    <Password sx={{ color: "lightblue", height: 20 }} />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setDeleteOpen(true);
                      setMenuAnchor(null);
                    }}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "white",
                    }}
                  >
                    <span>Delete Account</span>
                    <Delete sx={{ color: "red", height: 20 }} />
                  </MenuItem>
                </Stack>
              </Popover>
            </>
          )}
          <Stack direction="row" alignItems="center" spacing={2.5}>
            {top.type === "profile" && !isOwnProfile && (
              <Button
                variant="outlined"
                endIcon={isFollowing ? <Check /> : <PersonAdd />}
                onClick={handleFollowToggle}
                sx={{
                  borderColor: "lightblue",
                  color: "lightblue",
                }}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
            <Close onClick={onClose} sx={{ color: "red", cursor: "pointer" }} />
          </Stack>
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
      <ResetPasswordDialog open={resetOpen} setOpen={setResetOpen} />
      <DeleteAccountDialog open={deleteOpen} setOpen={setDeleteOpen} />
    </Dialog>
  );
}
