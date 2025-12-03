import { Button, Paper, Stack, Typography } from "@mui/material";
import { AvatarUpload } from "./AvatarUpload";
import { InfoSection } from "./InfoSection";
import { DescriptionSection } from "./DescriptionSection";
import { ResetPassword } from "./ResetPassword";
import { DeleteAccount } from "./DeleteAccount";
import { useFollowCreate, useFollowGetFollowing, useFollowRemove, useUserFindOne } from "../../../../hooks";
import type { SafeUserDto } from "../../../../types";

interface ProfileViewProps {
  userId: number;
  self: SafeUserDto | null;
  onClickFollowers: () => void;
  onClickFollowing: () => void;
}

export function ProfileView({ userId, self, onClickFollowers, onClickFollowing }: ProfileViewProps) {
  const { data: user, isLoading } = useUserFindOne(userId);
  const followCreate = useFollowCreate();
  const followRemove = useFollowRemove();
  const { data: followingList } = useFollowGetFollowing(self?.id || 0);
  const followRecord = followingList?.find((f) => f.following.id === userId);
  const isFollowing = !!followRecord;

  const handleFollowToggle = () => {
    if (!user || !self) return;
    if (isFollowing) followRemove.mutate(followRecord?.id as number);
    else followCreate.mutate({ followerId: self.id, followingId: user.id });
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  if (isLoading) return <Typography sx={{ p: 2 }}>Loading...</Typography>;
  if (!user) return null;

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={3} height="150px">
        <AvatarUpload currentUrl={user.avatarUrl} isOwnUser={user.id === self?.id} />
        <InfoSection user={user} isOwnUser={user.id === self?.id} />
        <Stack spacing={1} alignItems="center" height="100%" marginLeft="auto">
          <Paper onClick={user.followerCount ? onClickFollowers : () => {}} sx={{ backgroundColor: "#1e1e1e", cursor: "pointer", p: 1, textAlign: "center" }}>
            <Typography color="white">Followers</Typography>
            <Typography variant="h6" sx={{ color: "lightblue" }}>
              {formatNumber(user.followerCount)}
            </Typography>
          </Paper>
          <Paper onClick={user.followingCount ? onClickFollowing : () => {}} sx={{ backgroundColor: "#1e1e1e", cursor: "pointer", p: 1, textAlign: "center" }}>
            <Typography color="white">Following</Typography>
            <Typography variant="h6" sx={{ color: "lightblue" }}>
              {formatNumber(user.followingCount)}
            </Typography>
          </Paper>
        </Stack>
      </Stack>
      <DescriptionSection description={user.description || ""} isOwnUser={user.id === self?.id} />
      <Stack direction="row" spacing={2} alignSelf="center">
        {user.id === self?.id ? (
          <>
            <ResetPassword />
            <DeleteAccount />
          </>
        ) : (
          <Button variant={isFollowing ? "outlined" : "contained"} onClick={handleFollowToggle}>
            {isFollowing ? "Un-Follow" : "Follow"}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
