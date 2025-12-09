import { useMemo } from "react";
import { Button, IconButton, Stack } from "@mui/material";
import { Check, PersonAdd } from "@mui/icons-material";
import { useAuth } from "../../../context";
import {
  useFollowCreate,
  useFollowRemove,
  useFollowGetFollowing,
} from "../../../hooks";
import { buttonStyles, noTextButtonStyles } from "./styles";

interface Props {
  targetUserId: number;
  size?: "small" | "medium";
  displayText?: boolean;
}

export function FollowButton({
  targetUserId,
  size = "medium",
  displayText = true,
}: Props) {
  const { user } = useAuth();
  const { data: followingList = [] } = useFollowGetFollowing(
    user?.id as number
  );
  const followRecord = useMemo(
    () => followingList.find((f) => f.following.id === targetUserId),
    [followingList, targetUserId]
  );

  const isFollowing = !!followRecord;
  const followCreate = useFollowCreate(user?.id as number);
  const followRemove = useFollowRemove(user?.id as number);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!self) return;

    if (isFollowing) {
      followRemove.mutate({
        id: followRecord?.id ?? 0,
        followingId: targetUserId,
      });
    } else {
      followCreate.mutate({
        followerId: user?.id as number,
        followingId: targetUserId,
      });
    }
  };

  if (!self || user?.id === targetUserId) return null;
  if (!displayText) {
    return (
      <IconButton onClick={handleClick} sx={noTextButtonStyles}>
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
      sx={buttonStyles}
    >
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <span>{isFollowing ? "Following" : "Follow"}</span>
        {isFollowing ? <Check /> : <PersonAdd />}
      </Stack>
    </Button>
  );
}
