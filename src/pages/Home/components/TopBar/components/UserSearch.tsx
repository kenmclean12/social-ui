import { useMemo, useState, useEffect, useRef } from "react";
import {
  Input,
  Paper,
  List,
  ListItem,
  Avatar,
  Popper,
  Stack,
} from "@mui/material";
import { useUserFindAll, useFollowGetFollowing } from "../../../../../hooks";
import { ProfileDialog } from "../../../../../components/Profile";
import { useAuth } from "../../../../../context";
import type { UserResponseDto } from "../../../../../types";

export function UserSearch() {
  const { user } = useAuth();
  const popperRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: users } = useUserFindAll();
  const { data: following } = useFollowGetFollowing(user?.id ?? 0, {
    enabled: !!user?.id,
  });

  const filtered = useMemo(() => {
    if (!users || !user || !search.trim()) return [];

    const q = search.toLowerCase();

    const followingIds = new Set(following?.map((f) => f.following.id));

    const priority = (u: UserResponseDto) => {
      if (followingIds.has(u.id)) return 0;

      if (u.firstName?.toLowerCase().startsWith(q)) return 1;
      if (u.lastName?.toLowerCase().startsWith(q)) return 2;
      if (u.userName?.toLowerCase().startsWith(q)) return 3;
      if (u.email?.toLowerCase().startsWith(q)) return 4;
      return 99;
    };

    return users
      .filter((u) => u.id !== user.id)
      .filter((u) =>
        [u.firstName, u.lastName, u.userName, u.email]
          .filter(Boolean)
          .some((x) => x!.toLowerCase().includes(q))
      )
      .sort((a, b) => priority(a) - priority(b));
  }, [users, search, user, following]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popperRef.current &&
        !popperRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [anchorEl]);

  const isOpen =
    Boolean(anchorEl) &&
    isFocused &&
    search.trim().length > 0 &&
    filtered.length > 0;

  return (
    <>
      <Stack
        direction="row"
        flex={1}
        sx={{
          justifyContent: "center",
          flex: 1,
          flexShrink: 1,
          minWidth: 200,
          maxWidth: 800,
          px: 2,
        }}
      >
        <Input
          inputRef={(el) => setAnchorEl(el)}
          placeholder="Search users…"
          disableUnderline
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          sx={{
            height: "35px",
            width: "100%",
            minWidth: "300px",
            padding: "2px 16px",
            fontSize: "14px",
            color: "white",
            border: "1px solid white",
            borderRadius: 4,
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        />
        <Popper
          open={isOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          modifiers={[
            {
              enabled: true,
              phase: "beforeWrite",
              requires: ["computeStyles"],
              fn: ({ state }) => {
                state.styles.popper.width = `${
                  state.rects.reference.width + 16
                }px`;
              },
            },
          ]}
          style={{ width: "100%", zIndex: 30 }}
        >
          <Stack direction="row" ref={popperRef} width="100%">
            <Paper
              sx={{
                marginTop: "4px",
                marginLeft: "-10px",
                width: "100%",
                maxHeight: 250,
                overflowY: "auto",
                background: "#1e1e1e",
                border: "1px solid #444",
                borderTop: "none",
              }}
            >
              <List>
                {filtered.map((user) => (
                  <ListItem
                    key={user.id}
                    sx={{
                      display: "flex",
                      gap: 2,
                      color: "white",
                      cursor: "pointer",
                      "&:hover": { background: "#333" },
                    }}
                    onClick={() => {
                      setSelectedUserId(user.id);
                      setIsFocused(false);
                    }}
                  >
                    <Avatar src={user.avatarUrl} />
                    <span>
                      {user.firstName} {user.lastName} — @{user.userName}
                    </span>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Stack>
        </Popper>
      </Stack>
      {selectedUserId !== null && (
        <ProfileDialog
          open={true}
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}
