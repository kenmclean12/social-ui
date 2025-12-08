import { useState } from "react";
import { AppBar, Toolbar, Box, Stack } from "@mui/material";
import { NightsStay } from "@mui/icons-material";
import { useAuth } from "../../../../context";
import { Notifications, ProfileMenu, UserSearch } from "./components";
import { PostCreate, ProfileDialog } from "../../../../components";
import {
  iconContainerStyles,
  searchContainerStyles,
  toolbarStyles,
  topBarOptionsContainerStyles,
} from "./styles";

export function TopBar() {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={1}
        style={{ borderBottom: "1px solid lightblue" }}
      >
        <Toolbar sx={toolbarStyles}>
          <Stack sx={iconContainerStyles}>
            <NightsStay sx={{ color: "lightblue" }} />
          </Stack>
          <Box sx={searchContainerStyles}>
            <UserSearch />
          </Box>
          <Box sx={topBarOptionsContainerStyles}>
            <PostCreate />
            <Notifications />
            <ProfileMenu />
          </Box>
        </Toolbar>
      </AppBar>
      {profileOpen && (
        <ProfileDialog
          open={profileOpen}
          userId={user?.id as number}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}
