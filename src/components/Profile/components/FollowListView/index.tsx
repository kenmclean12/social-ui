import {
  Avatar,
  IconButton,
  Paper,
  Stack,
  Typography,
  Box,
  Input,
  InputAdornment,
  Button,
} from "@mui/material";
import {
  useFollowCreate,
  useFollowGetFollowers,
  useFollowGetFollowing,
} from "../../../../hooks";
import { Close } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useAuth } from "../../../../context";

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
  const { user } = useAuth();
  const [search, setSearch] = useState<string>("");
  const followersQuery = useFollowGetFollowers(userId, {
    enabled: listType === "followers",
  });
  const followingQuery = useFollowGetFollowing(userId, {
    enabled: listType === "following",
  });
  const query = listType === "followers" ? followersQuery : followingQuery;
  const { data: list, isLoading } = query;
  const { mutateAsync: followUser } = useFollowCreate(user?.id as number);

  const normalize = (val: string) =>
    (val ?? "").toString().toLowerCase().trim().replace(/\s+/g, "");

  const filtered = useMemo(() => {
    if (!list) return [];

    const s = normalize(search);

    if (!s) return list;

    return list.filter((f) => {
      const u = f.following ?? f.follower;

      const fields = [u?.firstName, u?.lastName, u?.userName, u?.email];

      return fields.some((field) => normalize(field).includes(s));
    });
  }, [list, search]);

  if (isLoading) return <Typography sx={{ p: 2 }}>Loading...</Typography>;
  if (!list || list.length === 0)
    return <Typography sx={{ p: 2 }}>No users</Typography>;

  return (
    <Box sx={{ height: "100%", p: 2 }}>
      <Input
        fullWidth
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disableUnderline
        endAdornment={
          search && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearch("")}
                sx={{ color: "#aaa" }}
              >
                <Close sx={{ height: 20 }} />
              </IconButton>
            </InputAdornment>
          )
        }
        sx={{
          height: 45,
          padding: "2px 12px",
          mb: 2,
          border: "1px solid black",
          backgroundColor: "#232222ff",
          borderRadius: 2,
          color: "white",
          fontSize: 14,
        }}
      />
      <Stack
        spacing={.5}
        sx={{
          height: "100%",
          overflowY: "auto",
          borderRadius: "8px",
        }}
      >
        {filtered.length === 0 && (
          <Typography align="center" sx={{ p: 2 }}>
            No matching users
          </Typography>
        )}
        {filtered.map((f) => {
          const user = f.following ?? f.follower;
          return (
            <Paper
              key={f.id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                backgroundColor: "black",
                cursor: "pointer",
                transition:
                  "background-color 0.15s ease, border-color 0.15s ease",
                "&:hover": {
                  backgroundColor: "#101",
                  borderColor: "lightblue",
                },
              }}
              onClick={() => onClickUser(user.id)}
            >
              <Avatar
                src={user.avatarUrl}
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
              <Stack direction="row" alignItems="center" spacing={0.5} ml={2}>
                <Typography color="white" sx={{ ml: 2 }}>
                  {user.firstName}
                </Typography>
                <Typography color="white" sx={{ ml: 2 }}>
                  {user.lastName}
                </Typography>
                <Typography color="white" sx={{ ml: 2 }}>
                  (@{user.userName})
                </Typography>
              </Stack>
              <Button
                variant="outlined"
                onClick={() => {
                  if (user?.id !== user.id) {
                    followUser({
                      followerId: user?.id as number,
                      followingId: user.id,
                    })
                  }
                }}
                sx={{
                  border: "1px solid lightblue",
                  color: "lightblue",
                  marginLeft: "auto",
                  cursor: "pointer",
                }}
              >
                Follow
              </Button>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
