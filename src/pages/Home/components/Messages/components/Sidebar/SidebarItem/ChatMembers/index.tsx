import { useState } from "react";
import { Popover, Stack, Divider, Typography } from "@mui/material";
import { Group } from "@mui/icons-material";
import type { UserResponseDto } from "../../../../../../../../types";
import { ProfileDialog, UserRow } from "../../../../../../../../components";
import { popoverPaperStyles } from "./styles";

interface Props {
  initiator: UserResponseDto;
  members: UserResponseDto[];
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export function ChatMembers({ initiator, members, anchorEl, onClose }: Props) {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  if (!members.length) return null;

  return (
    <>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: popoverPaperStyles }}
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={0.5}
            p={1}
          >
            <Typography align="center" fontSize="15px" color="white">
              Conversation Members
            </Typography>
            <Group sx={{ height: 20, color: "lightblue" }} />
          </Stack>
          <Divider sx={{ backgroundColor: "#444" }} />
          <UserRow
            user={initiator}
            message={`${initiator.firstName} ${initiator.lastName} (Owner)`}
            showUserName
            color="rgba(100,150,255,0.1)"
            onClick={(id) => setSelectedUserId(id)}
          />
          {members.map((m) => (
            <UserRow
              key={m.id}
              user={m}
              message={`${m.firstName} ${m.lastName}`}
              showUserName
              onClick={(id) => setSelectedUserId(id)}
            />
          ))}
        </Stack>
      </Popover>
      {selectedUserId !== null && (
        <ProfileDialog
          open={true}
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}
