import { useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  IconButton,
  Popover,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { EmojiEmotions } from "@mui/icons-material";
import { useAuth } from "../../../../../context";
import { useReactionCreate, useReactionFind } from "../../../../../hooks";

interface ReactionPanelProps {
  entityType: "post" | "message" | "comment";
  entityId: number;
  isSelf: boolean;
}

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export function ReactionPanel({
  entityType,
  entityId,
  isSelf,
}: ReactionPanelProps) {
  const { user } = useAuth();
  const { data: reactions = [] } = useReactionFind(entityType, entityId);
  const { mutate: createReaction } = useReactionCreate();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const userReaction = reactions.find((r) => r.user.id === user?.id);
  const handleReact = (emoji: string) => {
    if (isSelf) return;
    createReaction({
      userId: user?.id as number,
      [entityType + "Id"]: entityId,
      reaction: emoji,
    });
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <IconButton onClick={handleOpen} size="small">
          <EmojiEmotions
            sx={{ color: userReaction && !isSelf ? "lightblue" : "white" }}
          />
        </IconButton>
        <Typography
          sx={{ color: userReaction && !isSelf ? "lightblue" : "white" }}
        >
          {reactions ? reactions.length : 0}
        </Typography>
      </Stack>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Paper
          sx={{
            p: 1,
            backgroundColor: "#2a2a2a",
            maxWidth: 300,
            borderRadius: 1,
          }}
        >
          <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
            {EMOJIS.map((emoji) => (
              <IconButton
                key={emoji}
                onClick={() => handleReact(emoji)}
                sx={{
                  color: "white",
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "#333" },
                  opacity: userReaction?.reaction === emoji || isSelf ? 0.5 : 1,
                  pointerEvents:
                    userReaction?.reaction === emoji || isSelf
                      ? "none"
                      : "auto",
                  width: 40,
                  height: 40,
                }}
              >
                <Typography fontSize={20}>{emoji}</Typography>
              </IconButton>
            ))}
          </Stack>
          <Divider sx={{ backgroundColor: "#fff" }} />
          <List
            sx={{
              maxHeight: 200,
              overflowY: "auto",
              px: 0,
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "#555" },
            }}
          >
            {reactions.length > 0 ? (
              reactions.map((r) => (
                <ListItem
                  key={r.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    flexWrap: "wrap",
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#333" },
                    padding: "4px 8px",
                  }}
                >
                  <Typography fontSize={14} color="white">
                    {r.user.id === user?.id ? "You" : `${r.user.firstName}`}{" "}
                    reacted with{" "}
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography
                      component="span"
                      fontSize={24}
                      marginLeft="auto"
                    >
                      {r.reaction}
                    </Typography>
                  </Stack>
                </ListItem>
              ))
            ) : (
              <Typography align="center" p={1} fontSize="13px" color="white">
                No reactions yet
              </Typography>
            )}
          </List>
        </Paper>
      </Popover>
    </>
  );
}
