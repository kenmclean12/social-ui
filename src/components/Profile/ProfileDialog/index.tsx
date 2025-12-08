import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Delete,
  Password,
  ArrowBack,
  Close,
  Settings,
} from "@mui/icons-material";
import { useAuth } from "../../../context";
import { FollowListView, ProfileView } from "./components";
import { ResetPasswordDialog } from "./components/ProfileView/ResetPasswordDialog";
import { DeleteAccountDialog } from "./components/ProfileView/DeleteAccountDialog";
import { PopoverMenu, PopoverMenuItem } from "../../PopoverMenu";
import { FollowButton } from "../../Follow";
import {
  dialogPaperStyles,
  dialogTitleActionsContainerStyles,
  dialogTitleActionsInnerContainerStyles,
  dialogTitleStyles,
} from "./styles";

interface StackItem {
  type: "profile" | "followList";
  userId: number;
  listType?: "followers" | "following";
}

interface Props {
  open: boolean;
  userId: number;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  trigger?: ReactNode;
  onClose: () => void;
}

export function ProfileDialog({
  open,
  userId,
  setOpen,
  trigger,
  onClose,
}: Props) {
  const { user: self } = useAuth();
  const [resetOpen, setResetOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [stack, setStack] = useState<StackItem[]>([
    { type: "profile", userId },
  ]);

  const top = stack[stack.length - 1];
  const isOwnProfile = top.type === "profile" && top.userId === self?.id;

  const push = (item: StackItem) => {
    setStack((prev) => [...prev, item]);
  };
  const pop = () => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const getTitle = (item: StackItem) => {
    if (item.type === "profile") return "Profile";
    if (item.listType === "followers") return "Followers";
    return "Following";
  };

  const title = getTitle(top);
  if (!top) return null;

  return (
    <>
      {trigger && setOpen && (
        <span onClick={() => setOpen(true)} style={{ display: "inline-block" }}>
          {trigger}
        </span>
      )}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: dialogPaperStyles }}
      >
        <DialogTitle sx={dialogTitleStyles}>
          {stack.length > 1 && (
            <IconButton onClick={pop} sx={{ color: "lightblue" }}>
              <ArrowBack />
            </IconButton>
          )}
          {title}
          <Stack sx={dialogTitleActionsContainerStyles}>
            {isOwnProfile && (
              <PopoverMenu
                trigger={
                  <IconButton sx={{ color: "white", mr: 1 }}>
                    <Settings />
                  </IconButton>
                }
              >
                <PopoverMenuItem
                  label="Reset Password"
                  iconRight={
                    <Password sx={{ color: "lightblue", height: 16, ml: 1, mt: .5 }} />
                  }
                  onClick={() => setResetOpen(true)}
                  closeOnSelect
                />
                <PopoverMenuItem
                  label="Delete Account"
                  iconRight={<Delete sx={{ color: "red", height: 16, mt: .5 }} />}
                  onClick={() => setDeleteOpen(true)}
                  closeOnSelect
                />
              </PopoverMenu>
            )}
            <Stack sx={dialogTitleActionsInnerContainerStyles}>
              {top.type === "profile" && !isOwnProfile && (
                <FollowButton targetUserId={top.userId} />
              )}
              <Close
                onClick={onClose}
                sx={{ color: "red", cursor: "pointer" }}
              />
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
              onClickUser={(id: number) =>
                push({ type: "profile", userId: id })
              }
            />
          )}
        </DialogContent>
      </Dialog>
      <ResetPasswordDialog open={resetOpen} setOpen={setResetOpen} />
      <DeleteAccountDialog open={deleteOpen} setOpen={setDeleteOpen} />
    </>
  );
}
