import { useState } from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import { useAuth } from "../../../../context";
import { NightsStay } from "@mui/icons-material";
import {
  Notifications,
  ProfileMenu,
  UserSearch,
} from "./components";
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
          <Box sx={{ display: "flex", flexShrink: 0 }}>
            <NightsStay sx={{ height: "40px", color: "lightblue" }} />
          </Box>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <UserSearch />
          </Box>
          <Box sx={{ display: "flex", flexShrink: 0, gap: 1 }}>
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
