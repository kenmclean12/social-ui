import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useAuth } from "../../context";
import { FollowListView, ProfileView } from "./components";

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
  const [stack, setStack] = useState<StackItem[]>([{ type: "profile", userId }]);
  const top = stack[stack.length - 1];
  const push = (item: StackItem) => setStack((prev) => [...prev, item]);
  const pop = () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  const title =
    top.type === "profile"
      ? "Profile"
      : top.listType === "followers"
      ? "Followers"
      : "Following";

  if (!top) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { minWidth: "730px", backgroundColor: "#121212", color: "#fff" } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {stack.length > 1 && (
          <IconButton onClick={pop} sx={{ color: "lightblue" }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        {title}
        <IconButton onClick={onClose} sx={{ marginLeft: "auto", color: "red" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 0 }}>
        {top.type === "profile" ? (
          <ProfileView
            userId={top.userId}
            self={self}
            onClickFollowers={() =>
              push({ type: "followList", userId: top.userId, listType: "followers" })
            }
            onClickFollowing={() =>
              push({ type: "followList", userId: top.userId, listType: "following" })
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
    </Dialog>
  );
}