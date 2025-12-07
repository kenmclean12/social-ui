import { useState } from "react";
import { AppBar, Toolbar, Box, Stack } from "@mui/material";
import { NightsStay } from "@mui/icons-material";
import { useAuth } from "../../../../context";
import { Notifications, ProfileMenu, UserSearch } from "./components";
import { ProfileDialog } from "../../../../components/Profile";
import { PostCreate } from "../../../../components";

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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            flexWrap: "wrap",
            gap: 1.5,
            px: 1,
            backgroundColor: "black",
          }}
        >
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
