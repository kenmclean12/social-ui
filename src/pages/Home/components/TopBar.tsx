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
import { useAuth } from "../../../context";
import { NightsStay } from "@mui/icons-material";

export function TopBar() {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", gap: 2, backgroundColor: "black" }}>
        <NightsStay sx={{ height: "40px", color: "lightblue" }} />
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Input
            placeholder="Search users…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              width: "60%",
              padding: "2px 8px",
              color: "white",
              border: "1px solid lightblue", 
              borderRadius: 4,
            }}
          />
        </Box>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar
            sx={{ width: 36, height: 36 }}
            src={user?.avatarUrl || ""}
          />
        </IconButton>
        <Popover
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuList>
            <MenuItem onClick={logout}>
              <Typography>Logout</Typography>
            </MenuItem>
          </MenuList>
        </Popover>
      </Toolbar>
    </AppBar>
  );
}
