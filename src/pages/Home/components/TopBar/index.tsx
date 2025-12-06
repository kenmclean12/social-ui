import { useState } from "react";
import { AppBar, Toolbar, Box, Stack, Typography } from "@mui/material";
import { useAuth } from "../../../../context";
import { NightsStay } from "@mui/icons-material";
import { Notifications, ProfileMenu, UserSearch } from "./components";
import { CreatePost } from "../../../../components";
import { ProfileDialog } from "../../../../components/Profile";

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
        <Toolbar
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
            gap: 2,
          }}
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap={1}
            height="100%"
            minWidth="130px"
            pr={1.5}
          >
            <Typography color="white">Social</Typography>
            <NightsStay sx={{ color: "lightblue" }} />
          </Stack>
          <Box display="flex" flex={1} justifyContent="center">
            <UserSearch />
          </Box>
          <Box display="flex" flexShrink={0} gap={1} width="130px">
            <CreatePost />
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
