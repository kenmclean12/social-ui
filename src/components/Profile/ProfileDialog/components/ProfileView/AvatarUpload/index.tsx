import { useState, useRef } from "react";
import { Avatar, Box } from "@mui/material";
import { useUserUpdate } from "../../../../../../hooks";
import { CameraAlt } from "@mui/icons-material";
import {
  avatarStyles,
  cameraIconContainerStyles,
  mainContainerStyles,
} from "./styles";

interface Props {
  currentUrl?: string;
  isOwnUser: boolean;
}

export function AvatarUpload({ currentUrl, isOwnUser }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const { mutateAsync: updateUser } = useUserUpdate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      updateUser({ avatarUrl: base64String });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    if (!isOwnUser) return;
    inputRef.current?.click();
  };

  return (
    <Box
      onClick={triggerFileSelect}
      sx={{ ...mainContainerStyles, cursor: isOwnUser ? "pointer" : "default" }}
    >
      <Avatar src={preview} sx={avatarStyles} />
      {isOwnUser && (
        <Box sx={cameraIconContainerStyles}>
          <CameraAlt sx={{ fontSize: 18, color: "#fff" }} />
        </Box>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Box>
  );
}
