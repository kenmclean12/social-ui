import { Paper, Stack, Typography } from "@mui/material";
import { AvatarUpload } from "./AvatarUpload";
import { InfoSection } from "./InfoSection";
import { DescriptionSection } from "./DescriptionSection";
import { useUserFindOne } from "../../../../hooks";
import type { SafeUserDto } from "../../../../types";

interface ProfileViewProps {
  userId: number;
  self: SafeUserDto | null;
  onClickFollowers: () => void;
  onClickFollowing: () => void;
}

export function ProfileView({
  userId,
  self,
  onClickFollowers,
  onClickFollowing,
}: ProfileViewProps) {
  const { data: user, isLoading } = useUserFindOne(userId);

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
      <Stack direction="row" alignItems="center" spacing={3} height="300px">
        <Stack 
          alignItems="center" 
          justifyContent="center" 
          height="100%" 
          border="1px solid lightblue"
          borderRadius={2}
          paddingInline="12px"
          sx={{
            backgroundColor: "black",
          }}
        >
          <AvatarUpload
            currentUrl={user.avatarUrl}
            isOwnUser={user.id === self?.id}
          />
        </Stack>
        <InfoSection user={user} isOwnUser={user.id === self?.id} />
        <Stack spacing={1} alignItems="center" height="100%" marginLeft="auto">
          <Paper
            onClick={user.followerCount ? onClickFollowers : () => {}}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "145px",
              width: "100px",
              backgroundColor: "black",
              border: "1px solid lightblue",
              borderRadius: 2,
              cursor: "pointer",
              p: 1,
              textAlign: "center",
            }}
          >
            <Typography color="white">Followers</Typography>
            <Typography variant="h6" sx={{ color: "lightblue" }}>
              {formatNumber(user.followerCount)}
            </Typography>
          </Paper>
          <Paper
            onClick={user.followingCount ? onClickFollowing : () => {}}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "145px",
              width: "100px",
              backgroundColor: "black",
              border: "1px solid lightblue",
              borderRadius: 2,
              cursor: "pointer",
              p: 1,
              textAlign: "center",
            }}
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
    </Stack>
  );
}
