import { Avatar, IconButton, Paper, Stack, Typography } from "@mui/material";
import {
  useFollowGetFollowers,
  useFollowGetFollowing,
} from "../../../../hooks";
import { Visibility } from "@mui/icons-material";

interface FollowListViewProps {
  userId: number;
  listType: "followers" | "following" | undefined;
  onClickUser: (id: number) => void;
}

export function FollowListView({
  userId,
  listType,
  onClickUser,
}: FollowListViewProps) {
  const followersQuery = useFollowGetFollowers(userId, {
    enabled: listType === "followers",
  });
  const followingQuery = useFollowGetFollowing(userId, {
    enabled: listType === "following",
  });

  const query = listType === "followers" ? followersQuery : followingQuery;
  const { data: list, isLoading } = query;

  console.log(list)

  if (isLoading) return <Typography sx={{ p: 2 }}>Loading...</Typography>;
  if (!list || list.length === 0)
    return <Typography sx={{ p: 2 }}>No users</Typography>;

  return (
    <Stack spacing={1} sx={{ height: "400px", p: 2, overflowY: "auto" }}>
      {list.map((f) => (
        <Paper
          key={f.id}
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            backgroundColor: "black",
            cursor: "pointer",
          }}
          onClick={() => onClickUser(f.following?.id ?? f.follower?.id)}
        >
          <Avatar
            src={f.following?.avatarUrl ?? f.follower?.avatarUrl}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <Stack direction="row" alignItems="center" spacing={0.5} ml={2}>
            <Typography color="white" sx={{ ml: 2 }}>
              {f.following?.firstName ?? f.follower?.firstName}{" "}
            </Typography>
            <Typography color="white" sx={{ ml: 2 }}>
              {f.following?.lastName ?? f.follower?.lastName}{" "}
            </Typography>
            <Typography color="white" sx={{ ml: 2 }}>
              (@{f.following?.userName ?? f.follower?.userName})
            </Typography>
          </Stack>
          <IconButton sx={{ marginLeft: "auto", cursor: "pointer" }}>
            <Visibility sx={{ color: "white" }} />
          </IconButton>
        </Paper>
      ))}
    </Stack>
  );
}
