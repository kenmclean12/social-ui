import {
  IconButton,
  Popover,
  Stack,
  Avatar,
  Typography,
  Box
} from "@mui/material";
import { useState } from "react";
import type { UserResponseDto } from "../../../../../../../../types";

interface ChatMembersProps {
  members: UserResponseDto[];
}

export function ChatMembers({ members }: ChatMembersProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
console.log(members)
  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid #444",
          backgroundColor: "#222",
          color: "#fff",
          visibility: members.length > 1 ? "visible" : "hidden",
          marginLeft: "auto",
          "&:hover": {
            backgroundColor: "#333",
          },
        }}
      >
        <Typography>{members.length > 1 && `+${members.length}`}</Typography>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 240,
            backgroundColor: "#111",
            border: "1px solid #444",
            color: "#fff",
            p: 1,
          },
        }}
      >
        <Stack spacing={1}>
          {members.map((m) => (
            <Box
              key={m.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1,
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(100, 150, 255, 0.15)" },
              }}
            >
              <Avatar src={m.avatarUrl} />

              <Stack spacing={0} sx={{ overflow: "hidden" }}>
                <Typography sx={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
                  {m.firstName} {m.lastName}
                </Typography>
                <Typography sx={{ color: "#bbb", fontSize: 13 }}>
                  @{m.userName}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Popover>
    </>
  );
}
