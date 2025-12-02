import { useState } from "react";
import { IconButton, Avatar, Popover, MenuList, MenuItem, Typography } from "@mui/material";
import { useAuth } from "../../../../../context";
import { useUserFindOne } from "../../../../../hooks";
import { ProfileDialog } from "../../../../Profile";

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const { data: activeUser } = useUserFindOne(Number(user?.id));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar sx={{ width: 36, height: 36 }} src={activeUser?.avatarUrl || ""} />
      </IconButton>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
