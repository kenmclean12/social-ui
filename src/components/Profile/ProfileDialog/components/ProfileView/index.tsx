import { Stack, Paper, Typography } from "@mui/material";
import { AvatarUpload } from "./AvatarUpload";
import { InfoSection } from "./InfoSection";
import { DescriptionSection } from "./DescriptionSection";
import { PostSection } from "./PostSection";
import { useUserFindOne } from "../../../../../hooks";
import type { UserResponseDto } from "../../../../../types";
import {
  avatarContainerStyles,
  followDisplayContainerStyles,
  innerContainerStyles,
  mainContainerStyles,
} from "./styles";

const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

interface Props {
  userId: number;
  self: UserResponseDto | null;
  onClickFollowers: () => void;
  onClickFollowing: () => void;
}

export function ProfileView({
  userId,
  self,
  onClickFollowers,
  onClickFollowing,
}: Props) {
  const { data: user, isLoading } = useUserFindOne(userId);

  if (isLoading) return <Typography sx={{ p: 2 }}>Loading...</Typography>;
  if (!user) return null;

  return (
    <Stack sx={mainContainerStyles}>
      <Stack sx={innerContainerStyles}>
        <Stack sx={avatarContainerStyles}>
          <AvatarUpload
            currentUrl={user.avatarUrl}
            isOwnUser={user.id === self?.id}
          />
        </Stack>
        <InfoSection user={user} isOwnUser={user.id === self?.id} />
        <Stack alignItems="center" height="100%" spacing={1} marginLeft="auto">
          <Paper
            onClick={user.followerCount ? onClickFollowers : () => {}}
            sx={followDisplayContainerStyles}
          >
            <Typography color="white">Followers</Typography>
            <Typography variant="h6" sx={{ color: "lightblue" }}>
              {formatNumber(user.followerCount)}
            </Typography>
          </Paper>
          <Paper
            onClick={user.followingCount ? onClickFollowing : () => {}}
            sx={followDisplayContainerStyles}
          >
            <Typography color="white">Following</Typography>
            <Typography variant="h6" sx={{ color: "lightblue" }}>
              {formatNumber(user.followingCount)}
            </Typography>
          </Paper>
        </Stack>
      </Stack>
      <DescriptionSection
        description={user.description || ""}
        isOwnUser={user.id === self?.id}
      />
      <PostSection userId={userId} />
    </Stack>
  );
}
