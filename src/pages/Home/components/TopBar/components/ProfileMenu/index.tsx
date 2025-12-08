import { useState } from "react";
import { IconButton, Avatar } from "@mui/material";
import { useAuth } from "../../../../../../context";
import { useUserFindOne } from "../../../../../../hooks";
import { ProfileDialog } from "../../../../../../components/Profile/ProfileDialog";
import { avatarStyles } from "./styles";
import { PopoverMenu, PopoverMenuItem } from "../../../../../../components";

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const { data: activeUser } = useUserFindOne(Number(user?.id));

  return (
    <>
      <PopoverMenu
        trigger={
          <IconButton>
            <Avatar src={activeUser?.avatarUrl || ""} sx={avatarStyles} />
          </IconButton>
        }
      >
        <PopoverMenuItem
          label="Profile"
          onClick={() => setProfileOpen(true)}
          closeOnSelect
        />
        <PopoverMenuItem label="Logout" onClick={logout} closeOnSelect />
      </PopoverMenu>
      <ProfileDialog
        open={profileOpen}
        userId={user?.id as number}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}
