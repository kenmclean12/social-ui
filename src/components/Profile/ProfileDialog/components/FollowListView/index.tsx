import { useState, useMemo } from "react";
import {
  IconButton,
  Stack,
  Typography,
  Box,
  Input,
  InputAdornment,
} from "@mui/material";
import {
  useFollowGetFollowers,
  useFollowGetFollowing,
} from "../../../../../hooks";
import { Close } from "@mui/icons-material";
import { UserRow } from "../../../../User";

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
          border: "1px solid #444",
          backgroundColor: "#1e1e1e",
          borderRadius: 2,
          color: "white",
          fontSize: 14,
        }}
      />
      <Stack
        spacing={0.5}
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
          const userObj = f.following ?? f.follower;
          return (
            <UserRow
              key={userObj.id}
              user={userObj}
              onClick={(id) => onClickUser(id)}
              showFollowButton={true}
              showUserName={true}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
