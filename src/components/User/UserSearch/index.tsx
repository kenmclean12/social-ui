import { useState, useEffect, useRef } from "react";
import { Input, Paper, Popper, Stack, Button, Box } from "@mui/material";
import { useUserSearch } from "../../../hooks";
import { ProfileDialog } from "../../Profile/ProfileDialog";
import { Close } from "@mui/icons-material";
import { UserRow } from "../UserRow";
import {
  clearIconStyles,
  dropdownContainerStyles,
  inputContainerStyles,
  inputStyles,
  mainContainerStyles,
} from "./styles";

export function UserSearch() {
  const popperRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { data: users = [] } = useUserSearch(search);

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
    users.length > 0;

  return (
    <>
      <Stack sx={mainContainerStyles}>
        <Stack sx={inputContainerStyles}>
          <Input
            inputRef={(el) => setAnchorEl(el)}
            placeholder="Search users…"
            disableUnderline
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            sx={inputStyles}
          />
          {search.trim().length > 0 && (
            <Button
              onClick={() => {
                setSearch("");
                setIsFocused(false);
              }}
              sx={clearIconStyles}
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
            <Paper sx={dropdownContainerStyles}>
              {users?.map((u) => (
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
