import { Popover, Stack, Avatar, Typography, Box, Divider } from "@mui/material";
import type { UserResponseDto } from "../../../../../../../../types";
import { Group } from "@mui/icons-material";

interface ChatMembersProps {
  members: UserResponseDto[];
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export function ChatMembers({ members, anchorEl, onClose }: ChatMembersProps) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
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
        <Stack direction="row" alignSelf="center" alignItems="center" justifyContent="center" spacing={0.5}>
          <Typography align="center" fontSize="13px" color="white">
            Conversation Members
          </Typography>
          <Group sx={{ height: 20, color: "lightblue" }} />
        </Stack>
        <Divider sx={{ backgroundColor: "#444" }} />
        {members.map((m) => (
          <Box
            key={m.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1,
              borderRadius: 1,
              "&:hover": { backgroundColor: "rgba(100,150,255,0.15)" },
            }}
          >
            <Avatar src={m.avatarUrl} />
            <Stack spacing={0} sx={{ overflow: "hidden" }}>
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                {m.firstName} {m.lastName}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#bbb" }}>
                @{m.userName}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Popover>
  );
}
