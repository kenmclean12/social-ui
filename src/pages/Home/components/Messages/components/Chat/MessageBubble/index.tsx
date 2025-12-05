import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  IconButton,
  Popover,
  MenuItem,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import type { MessageResponseDto } from "../../../../../../../types";
import { ReactionPanel } from "../../../../../../../components/Post/PostCard/components";
import { useAuth } from "../../../../../../../context";
import {
  useLikeCreate,
  useLikeDelete,
  useLikeFind,
  useMessageUpdate,
  useMessageDelete,
} from "../../../../../../../hooks";
import { Settings } from "@mui/icons-material";

interface MessageBubbleProps {
  message: MessageResponseDto;
  isMe: boolean;
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const { user } = useAuth();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState(message.content);

  const { data: likes = [] } = useLikeFind("message", message.id);
  const { mutateAsync: createLike } = useLikeCreate();
  const removeLike = useLikeDelete();
  const updateMessage = useMessageUpdate();
  const deleteMessage = useMessageDelete();

  const myLike = useMemo(
    () => likes.find((l) => l.userId === user?.id),
    [likes, user]
  );

  const handleToggleLike = () => {
    if (isMe) return;
    if (myLike) {
      removeLike.mutate(myLike.id);
    } else {
      createLike({
        userId: user?.id as number,
        messageId: message.id,
      });
    }
  };

  const handleUpdate = () => {
    updateMessage.mutate(
      {
        id: message.id,
        dto: { content: editValue },
      },
      {
        onSuccess: () => {
          setEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMessage.mutate(message.id);
  };

  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={isMe ? "flex-end" : "flex-start"}
      mb={2}
      gap={0.5}
    >
      {!isMe ? (
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <Avatar
            src={message.sender.avatarUrl}
            sx={{ width: 28, height: 28 }}
          />
          <Typography fontSize={13} color="#ccc">
            {message.sender.firstName} {message.sender.lastName}
          </Typography>
          <Typography
            fontSize={11}
            color="#aaa"
            sx={{
              userSelect: "none",
              pt: 0.25,
              whiteSpace: "nowrap",
            }}
          >
            {timestamp}
          </Typography>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Typography
            fontSize={11}
            color="#aaa"
            sx={{
              userSelect: "none",
              pb: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            {timestamp}
          </Typography>
        </Stack>
      )}
      <Stack
        direction="row"
        alignItems="flex-end"
        spacing={0.7}
        justifyContent={isMe ? "flex-end" : "flex-start"}
        width="50%"
      >
        <Paper
          elevation={2}
          sx={{
            maxWidth: "90%",
            p: 1.3,
            background: isMe ? "#1976d2" : "#2a2a2a",
            color: "white",
            borderRadius: 3,
          }}
        >
          {editing ? (
            <Stack direction="row" spacing={1}>
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                style={{
                  padding: 6,
                  background: "#111",
                  color: "white",
                  borderRadius: 6,
                  border: "1px solid #444",
                  width: "100%",
                }}
              />
              <IconButton
                size="small"
                onClick={handleUpdate}
                sx={{ color: "lightblue" }}
              >
                <Edit />
              </IconButton>
            </Stack>
          ) : (
            <Typography fontSize={15}>{message.content}</Typography>
          )}
        </Paper>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.2}
        mt={0.2}
        sx={{
          opacity: 0.9,
          width: "100%",
          justifyContent: isMe ? "flex-end" : "flex-start",
        }}
      >
        {isMe && (
          <>
            <IconButton
              size="small"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{ color: "white", p: 0.3, pr: .75 }}
            >
              <Settings />
            </IconButton>
            <Popover
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  backgroundColor: "#1e1e1e",
                  minWidth: 200,
                  padding: "5px 0",
                  border: "1px solid #444",
                },
              }}
            >
              <Stack spacing={1}>
                <MenuItem
                  onClick={() => {
                    setEditing(true);
                    setEditValue(message.content);
                    setMenuAnchor(null);
                  }}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "white",
                  }}
                >
                  Update
                  <Edit sx={{ color: "lightblue", height: 20 }} />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleDelete();
                    setMenuAnchor(null);
                  }}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "white",
                  }}
                >
                  Delete
                  <Delete sx={{ color: "red", height: 20 }} />
                </MenuItem>
              </Stack>
            </Popover>
          </>
        )}
        <ReactionPanel
          entityType="message"
          entityId={message.id}
          isSelf={isMe}
          direction="right"
        />
        <Stack direction="row" alignItems="center" spacing={0.3}>
          <IconButton
            size="small"
            onClick={handleToggleLike}
            sx={{
              color: myLike ? "lightblue" : "white",
              p: 0.3,
              opacity: isMe ? 0.4 : 1,
            }}
          >
            {myLike ? (
              <FavoriteIcon sx={{ height: 25 }} />
            ) : (
              <FavoriteBorderIcon sx={{ height: 25 }} />
            )}
          </IconButton>
          <Typography fontSize={13} color="white">
            {likes.length}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
