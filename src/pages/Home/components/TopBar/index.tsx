import { useState } from "react";
import { AppBar, Toolbar, Box, Stack } from "@mui/material";
import { NightsStay } from "@mui/icons-material";
import { useAuth } from "../../../../context";
import { Notifications, ProfileMenu, UserSearch } from "./components";
import { PostCreate, ProfileDialog } from "../../../../components";
import { toolbarStyles } from "./styles";

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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            flexShrink={0}
            pl={1}
          >
            <NightsStay sx={{ color: "lightblue" }} />
          </Stack>
          <Box display="flex" flex={1} justifyContent="center" minWidth={0}>
            <UserSearch />
          </Box>
          <Box display="flex" gap={1} flexShrink={0}>
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
