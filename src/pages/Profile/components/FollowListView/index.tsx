import {
  Avatar,
  IconButton,
  Paper,
  Stack,
  Typography,
  Box,
  Input,
  InputAdornment,
} from "@mui/material";
import {
  useFollowGetFollowers,
  useFollowGetFollowing,
} from "../../../../hooks";
import { Close, Visibility } from "@mui/icons-material";
import { useState, useMemo } from "react";

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
  const [search, setSearch] = useState<string>("");
  const followersQuery = useFollowGetFollowers(userId, {
    enabled: listType === "followers",
  });
  const followingQuery = useFollowGetFollowing(userId, {
    enabled: listType === "following",
  });
  const query = listType === "followers" ? followersQuery : followingQuery;
  const { data: list, isLoading } = query;

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
    <Box sx={{ p: 2 }}>
      <Input
        fullWidth
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        endAdornment={
          search && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearch("")}
                sx={{ color: "#aaa" }}
              >
                <Close />
              </IconButton>
            </InputAdornment>
          )
        }
        sx={{
          padding: 1,
          mb: 2,
          border: "1px solid #ccc",
          borderRadius: 2,
          input: { color: "white" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#ccc" },
            "&:hover fieldset": { borderColor: "#ccc" },
            "&.Mui-focused fieldset": { borderColor: "#ccc" },
          },
        }}
      />
      <Stack
        spacing={1}
        sx={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          p: 1,
        }}
      >
        {filtered.length === 0 && (
          <Typography align="center" sx={{ p: 3 }}>
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
              <IconButton sx={{ marginLeft: "auto", cursor: "pointer" }}>
                <Visibility sx={{ color: "white" }} />
              </IconButton>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
