import { useState } from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import { useAuth } from "../../../../context";
import { NightsStay } from "@mui/icons-material";
import { ProfileDialog } from "../../../Profile";
import { CreatePost, Notifications, ProfileMenu, UserSearch } from "./components";

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
            justifyContent: "space-between",
            minWidth: "500px", 
            gap: 2, 
            backgroundColor: "black", 
          }}
        >
          <NightsStay sx={{ height: "40px", color: "lightblue" }} />
          <UserSearch />
          <Box sx={{ display: "flex", gap: 1 }}>
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
