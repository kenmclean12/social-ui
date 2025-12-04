import {
  Stack,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useAuth } from "../../../../context";
import {
  useReactionCreate,
  useReactionDelete,
  useReactionFind,
} from "../../../../hooks/reaction";

interface ReactionPanelProps {
  entityType: "post" | "message" | "comment";
  entityId: number;
}

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export function ReactionPanel({ entityType, entityId }: ReactionPanelProps) {
  const { user } = useAuth();
  const { data: reactions = [] } = useReactionFind(entityType, entityId);
  const { mutate: createReaction } = useReactionCreate();
  const { mutate: deleteReaction } = useReactionDelete();

  const handleReact = (emoji: string) => {
    createReaction({
      userId: user?.id as number,
      [entityType + "Id"]: entityId,
      reaction: emoji,
    });
  };

  const handleRemove = (reactionId: number) => {
    deleteReaction(reactionId);
  };

  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: "#2a2a2a",
        borderRadius: 2,
        maxWidth: 400,
      }}
    >
      <Stack direction="row" spacing={1} mb={1}>
        {EMOJIS.map((emoji) => (
          <Tooltip key={emoji} title={`React with ${emoji}`}>
            <IconButton
              onClick={() => handleReact(emoji)}
              sx={{ color: "white" }}
            >
              <Typography fontSize={20}>{emoji}</Typography>
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
      <Stack spacing={1}>
        {reactions.map((r) => (
          <Stack
            key={r.id}
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography fontSize={18}>{r.reaction || "❓"}</Typography>
            <Paper
              sx={{
                p: "2px 6px",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "#1e1e1e",
              }}
            >
              <Avatar
                src={r.user.avatarUrl || ""}
                sx={{ width: 20, height: 20 }}
              />
              <Typography fontSize={12} color="white">
                {r.user.firstName} {r.user.lastName} (@{r.user.userName})
              </Typography>
              {r.user.id === user?.id && (
                <IconButton
                  size="small"
                  onClick={() => handleRemove(r.id)}
                  sx={{ color: "red" }}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Paper>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
