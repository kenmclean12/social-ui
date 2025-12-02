import { useState, useRef } from "react";
import { Avatar, Box } from "@mui/material";
import { useUserUpdate } from "../../../../hooks";
import { CameraAlt } from "@mui/icons-material";

interface AvatarUploadProps {
  currentUrl?: string;
  isOwnUser: boolean;
}

export function AvatarUpload({ currentUrl, isOwnUser }: AvatarUploadProps) {
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
      sx={{
        position: "relative",
        display: "inline-block",
        cursor: isOwnUser ? "pointer" : "default",
      }}
      onClick={triggerFileSelect}
    >
      <Avatar
        src={preview}
        sx={{ width: 110, height: 110, border: "2px solid #6BB6FF" }}
      />
      {isOwnUser && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "#6BB6FF",
            borderRadius: "50%",
            p: 0.5,
          }}
        >
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
