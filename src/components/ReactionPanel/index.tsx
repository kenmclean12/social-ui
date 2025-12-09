import { useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  IconButton,
  Popover,
  List,
  Box,
  Tooltip,
} from "@mui/material";
import { Close, EmojiEmotions } from "@mui/icons-material";
import { useAuth } from "../../context";
import { useReactionCreate, useReactionDelete } from "../../hooks";
import type { ReactionResponseDto } from "../../types";
import { UserRow } from "../User";
import {
  closeIconStyles,
  emojiIconButtonStyles,
  noReactionsDisplayContainerStyles,
  paperStyles,
  popoverStyles,
  reactionContainerStyles,
  reactWithTextStyles,
  triggerContainerStyles,
  userListContainerStyles,
} from "./styles";

interface ReactionPanelProps {
  entityType: "post" | "message" | "comment";
  reactionEntries: ReactionResponseDto[] | undefined;
  entityId: number;
  isSelf: boolean;
  direction?: "left" | "right";
  smallIcon?: boolean;
}

export function ReactionPanel({
  entityType,
  reactionEntries,
  entityId,
  isSelf,
  direction = "left",
  smallIcon,
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
      removeReaction(userReaction.id);
      setReactions((prev) => prev.filter((r) => r.id !== userReaction.id));
    }

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

    setAnchorEl(null);
  };

  const groupedReactions = reactions.reduce((acc, reaction) => {
    const emoji = reaction.reaction;
    if (!acc[emoji]) {
      acc[emoji] = [];
    }
    acc[emoji].push(reaction);
    return acc;
  }, {} as Record<string, ReactionResponseDto[]>);

  return (
    <>
      <Stack
        sx={{ ...triggerContainerStyles, gap: smallIcon ? 0 : .8 }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <EmojiEmotions
          sx={{
            height: smallIcon ? 16 : "auto",
            color: userReaction && !isSelf ? "lightblue" : "white",
          }}
        />
        <Typography
          sx={{
            fontSize: smallIcon ? 13 : "auto",
            color: userReaction && !isSelf ? "lightblue" : "white",
          }}
        >
          {reactions ? reactions.length : 0}
        </Typography>
      </Stack>
      <Popover
        open={Boolean(anchorEl)}
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
        sx={popoverStyles}
      >
        <Paper sx={paperStyles}>
          <Box p={2} borderBottom="1px solid #333">
            <Typography variant="subtitle2" sx={reactWithTextStyles}>
              React with
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              spacing={0.7}
              flexWrap="wrap"
            >
              {EMOJIS.map(({ emoji, label }) => (
                <Tooltip key={emoji} title={label} arrow>
                  <IconButton
                    onClick={() => handleReact(emoji)}
                    disabled={isSelf}
                    sx={{
                      ...emojiIconButtonStyles,
                      backgroundColor:
                        userReaction?.reaction === emoji
                          ? "rgba(79, 195, 247, 0.2)"
                          : "transparent",
                      "&:hover": {
                        backgroundColor:
                          userReaction?.reaction === emoji
                            ? "rgba(79, 195, 247, 0.3)"
                            : "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <Typography fontSize={22}>{emoji}</Typography>
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </Box>
          <Box sx={reactionContainerStyles}>
            {reactions.length > 0 ? (
              <Box sx={{ p: 1 }}>
                {Object.entries(groupedReactions).map(
                  ([emoji, emojiReactions]) => (
                    <Box key={emoji} sx={{ mb: 1 }}>
                      <List sx={{ p: 0, gap: "0px" }}>
                        {emojiReactions.map((reaction) => (
                          <Box key={reaction.id} sx={userListContainerStyles}>
                            <UserRow
                              user={reaction.user}
                              message={
                                reaction.user.id === user?.id
                                  ? "You reacted with"
                                  : `${reaction.user.firstName} reacted with`
                              }
                              button={
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1.5}
                                >
                                  <span>{reaction.reaction}</span>
                                  {reaction.user.id === user?.id && (
                                    <Close
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        removeReaction(reaction.id);
                                        setReactions((prev) =>
                                          prev.filter(
                                            (x) => x.id !== reaction.id
                                          )
                                        );
                                      }}
                                      sx={closeIconStyles}
                                    />
                                  )}
                                </Stack>
                              }
                            />
                          </Box>
                        ))}
                      </List>
                    </Box>
                  )
                )}
              </Box>
            ) : (
              <Box sx={noReactionsDisplayContainerStyles}>
                <EmojiEmotions sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2" align="center">
                  No reactions yet
                </Typography>
                <Typography
                  align="center"
                  variant="caption"
                  sx={{ mt: 0.5, opacity: 0.7 }}
                >
                  Be the first to react
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Popover>
    </>
  );
}

const EMOJIS = [
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "😂", label: "Laughing" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "🔥", label: "Fire" },
];
