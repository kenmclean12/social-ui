import { Button, IconButton, Stack } from "@mui/material";
import { Check, PersonAdd } from "@mui/icons-material";
import { useAuth } from "../../../context";
import {
  useFollowCreate,
  useFollowRemove,
  useFollowGetFollowing,
} from "../../../hooks";
import { useMemo } from "react";

interface Props {
  targetUserId: number;
  size?: "small" | "medium";
  displayText?: boolean; // false = icon only
}

export function FollowButton({
  targetUserId,
  size = "medium",
  displayText = true,
}: Props) {
  const { user: self } = useAuth();
  const { data: followingList } = useFollowGetFollowing(self?.id ?? 0);
  const followRecord = useMemo(
    () => followingList?.find((f) => f.following.id === targetUserId),
    [followingList, targetUserId]
  );

  const isFollowing = !!followRecord;
  const followCreate = useFollowCreate(self?.id ?? 0);
  const followRemove = useFollowRemove(self?.id ?? 0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!self) return;

    if (isFollowing) {
      followRemove.mutate({
        id: followRecord?.id ?? 0,
        followingId: targetUserId,
      });
    } else {
      followCreate.mutate({ followerId: self.id, followingId: targetUserId });
    }
  };

  if (!self || self.id === targetUserId) return null;

  if (!displayText) {
    return (
      <IconButton
        onClick={handleClick}
        sx={{
          width: 35,
          height: 35,
          borderRadius: 1,
          backgroundColor: "black",
          border: "1px solid lightblue",
          color: "lightblue",
          "&:hover": { backgroundColor: "#111" },
        }}
      >
        {isFollowing ? (
          <Check style={{ height: 20 }} />
        ) : (
          <PersonAdd style={{ height: 20 }} />
        )}
      </IconButton>
    );
  }

  return (
    <Button
      variant="outlined"
      size={size}
      onClick={handleClick}
      sx={{
        backgroundColor: "black",
        borderColor: "lightblue",
        color: "lightblue",
        ml: "auto",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {isFollowing ? "Following" : "Follow"}
        {isFollowing ? <Check /> : <PersonAdd />}
      </Stack>
    </Button>
  );
}
