// components/TopBar.tsx
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Popover,
  MenuList,
  MenuItem,
  Typography,
  Input,
} from "@mui/material";
import { useAuth } from "../../../../context";
import { NightsStay } from "@mui/icons-material";
import { ProfileDialog } from "../../../Profile";
import { useUserFindOne } from "../../../../hooks";

export function TopBar() {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const { data: activeUser } = useUserFindOne(Number(user?.id));

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
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar
              sx={{ width: 36, height: 36 }}
              src={activeUser?.avatarUrl || ""}
            />
          </IconButton>
          <Popover
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuList style={{ width: "175px" }}>
              <MenuItem
                onClick={() => {
                  setProfileOpen(true);
                  setAnchorEl(null);
                }}
              >
                <Typography>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={logout}>
                <Typography>Logout</Typography>
              </MenuItem>
            </MenuList>
          </Popover>
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
