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
import { Close, EmojiEmotions } from "@mui/icons-material";
import { useAuth } from "../../context";
import { useReactionCreate, useReactionDelete } from "../../hooks";
import type { ReactionResponseDto } from "../../types";

interface ReactionPanelProps {
  entityType: "post" | "message" | "comment";
  reactionEntries: ReactionResponseDto[] | undefined;
  entityId: number;
  isSelf: boolean;
  direction?: "left" | "right";
}

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export function ReactionPanel({
  entityType,
  reactionEntries,
  entityId,
  isSelf,
  direction,
}: ReactionPanelProps) {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [reactions, setReactions] = useState<ReactionResponseDto[]>(
    reactionEntries ?? []
  );

  const { mutate: createReaction } = useReactionCreate();
  const { mutate: removeReaction } = useReactionDelete();
  const userReaction = reactions.find((r) => r.user.id === user?.id);

  const handleReact = async (emoji: string) => {
    if (isSelf) return;

    if (userReaction) {
      await removeReaction(userReaction.id);
      setReactions((prev) => prev.filter((r) => r.id !== userReaction.id));
    } else {
      createReaction(
        {
          userId: user?.id as number,
          [entityType + "Id"]: entityId,
          reaction: emoji,
        },
        {
          onSuccess: (newReaction: ReactionResponseDto) => {
            setReactions((prev) => [...prev, newReaction]);
          },
        }
      );
    }

   setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Stack direction="row" alignItems="center">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
          <EmojiEmotions
            sx={{ height: 25, color: userReaction && !isSelf ? "lightblue" : "white" }}
          />
        </IconButton>
        <Typography
          sx={{ color: userReaction && !isSelf ? "lightblue" : "white" }}
        >
          {reactions.length}
        </Typography>
      </Stack>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction === "right" ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction === "right" ? "left" : "right",
        }}
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
                    {r.user.id === user?.id ? "You" : r.user.firstName} reacted
                    with{" "}
                  </Typography>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography component="span" fontSize={24}>
                      {r.reaction}
                    </Typography>
                    {r.user.id === user?.id && (
                      <Close
                        onClick={async () => {
                          await removeReaction(r.id);
                          setReactions((prev) =>
                            prev.filter((x) => x.id !== r.id)
                          );
                        }}
                      />
                    )}
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
