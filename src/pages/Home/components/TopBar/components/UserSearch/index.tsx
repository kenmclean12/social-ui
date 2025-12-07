import { useMemo, useState, useEffect, useRef } from "react";
import { Input, Paper, Popper, Stack, Button, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useUserFindAll, useFollowGetFollowing } from "../../../../../../hooks";
import { useAuth } from "../../../../../../context";
import type { UserResponseDto } from "../../../../../../types";
import { ProfileDialog, UserRow } from "../../../../../../components";
import {
  clearSearchButtonStyles,
  dropdownMenuPaperStyles,
  userSearchInputStyles,
} from "./styles";

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
        justifyContent="center"
        flex={1}
        flexShrink={1}
        minWidth={200}
        maxWidth={800}
        px={2}
      >
        <Stack
          position="relative"
          direction="row"
          justifyContent="center"
          flex={1}
          flexShrink={1}
          minWidth={200}
          maxWidth={800}
          px={2}
        >
          <Input
            inputRef={(el) => setAnchorEl(el)}
            placeholder="Search users…"
            disableUnderline
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            sx={userSearchInputStyles}
          />
          {search.trim().length > 0 && (
            <Button
              onClick={() => {
                setSearch("");
                setIsFocused(false);
              }}
              sx={clearSearchButtonStyles}
            >
              <Close sx={{ height: 20 }} />
            </Button>
          )}
        </Stack>
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
            <Paper sx={dropdownMenuPaperStyles}>
              {filtered.map((u) => (
                <Box
                  key={u.id}
                  onClick={() => {
                    setSelectedUserId(u.id);
                    setIsFocused(false);
                  }}
                >
                  <UserRow user={u} showFollowButtonSmall showUserName />
                </Box>
              ))}
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
