import { Button } from "@mui/material";
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
}

export function FollowButton({ targetUserId, size = "medium" }: Props) {
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

  return (
    <Button
      variant="outlined"
      size={size}
      onClick={handleClick}
      endIcon={isFollowing ? <Check /> : <PersonAdd />}
      sx={{
        backgroundColor: "black",
        borderColor: "lightblue",
        color: "lightblue",
        ml: "auto",
      }}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
