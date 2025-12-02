import { useState } from "react";
import { AppBar, Toolbar, Box, Input } from "@mui/material";
import { useAuth } from "../../../../context";
import { NightsStay } from "@mui/icons-material";
import { ProfileDialog } from "../../../Profile";
import { Notifications, ProfileMenu } from "./components";

export function TopBar() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={1}
        style={{ borderBottom: "1px solid lightblue" }}
      >
        <Toolbar sx={{ display: "flex", gap: 2, backgroundColor: "black" }}>
          <NightsStay sx={{ height: "40px", color: "lightblue" }} />
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Input
              placeholder="Search users…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                height: "35px",
                width: "60%",
                padding: "2px 16px",
                fontSize: "14px",
                color: "white",
                border: "1px solid lightblue",
                borderRadius: 4,
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
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
