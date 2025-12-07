import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  IconButton,
  Popover,
  MenuItem,
  Input,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../context";
import type { MessageResponseDto } from "../../../types";
import { useLikeCreate, useLikeDelete, useLikeFind, useMessageDelete, useMessageMarkRead, useMessageUpdate } from "../../../hooks";
import { Settings } from "@mui/icons-material";
import { ReactionPanel } from "../../ReactionPanel";

interface Props {
  message: MessageResponseDto;
  isMe: boolean;
}

const sentReadRequests = new Set<number>();

export function MessageBubble({ message, isMe }: Props) {
  const { user } = useAuth();
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [readsAnchor, setReadsAnchor] = useState<HTMLElement | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(message.content);

  const { data: likes = [] } = useLikeFind("message", message.id);
  const { mutateAsync: createLike } = useLikeCreate();
  const { mutateAsync: removeLike } = useLikeDelete();
  const { mutateAsync: updateMessage } = useMessageUpdate();
  const { mutateAsync: deleteMessage } = useMessageDelete();
  const { mutateAsync: markRead } = useMessageMarkRead();

  const myLike = useMemo(() => likes.find((l) => l.userId === user?.id), [likes, user]);
  const hasRead = useMemo(() => message.reads?.find((r) => r.user.id === user?.id ), [message.reads, user?.id]);

  useEffect(() => {
    if (!message || !user) return;
    if (message.sender.id === user.id) return;
    if (sentReadRequests.has(message.id)) return;
    if (hasRead) return;

    sentReadRequests.add(message.id);

    markRead({ messageId: message.id, userId: user.id });
  }, [hasRead, markRead, message, message.id, user, user?.id]);

  const handleToggleLike = async () => {
    if (isMe) return;
    if (myLike) await removeLike(myLike.id);
    else await createLike({ userId: user?.id as number, messageId: message.id });
  };

  const handleUpdate = async () => {
    await updateMessage({ id: message.id, dto: { content: editValue } });
    setEditing(false);
  };

  const handleDelete = async () => await deleteMessage(message.id);

  const timestamp = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const readCount = message.reads?.length || 0;

  const likeIcon = myLike ? (
    <FavoriteIcon sx={{ height: 25, color: "lightblue" }} />
  ) : likes.length > 0 ? (
    <FavoriteIcon sx={{ height: 25, color: "#fff" }} />
  ) : (
    <FavoriteBorderIcon sx={{ height: 25, color: "#fff" }} />
  );

  const likeColor = myLike ? "lightblue" : "#fff";

  return (
    <Box display="flex" flexDirection="column" alignItems={isMe ? "flex-end" : "flex-start"} mb={2} gap={0.5}>
      {!isMe ? (
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <Avatar src={message.sender.avatarUrl} sx={{ width: 28, height: 28 }} />
          <Typography fontSize={13} color="#ccc">
            {message.sender.firstName} {message.sender.lastName}
          </Typography>
          <Typography fontSize={11} color="#aaa" sx={{ userSelect: "none", pt: 0.25, whiteSpace: "nowrap" }}>
            {timestamp}
          </Typography>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Typography fontSize={11} color="#aaa" sx={{ userSelect: "none", pb: 0.5, whiteSpace: "nowrap" }}>
            {timestamp}
          </Typography>
        </Stack>
      )}

      <Stack direction="row" alignItems="flex-end" spacing={0.7} justifyContent={isMe ? "flex-end" : "flex-start"} width="50%">
        <Paper
          elevation={2}
          sx={{
            maxWidth: "90%",
            p: 1.3,
            background: "lightblue",
            border: "1px solid black",
            color: "black",
            borderRadius: 3,
          }}
        >
          {editing ? (
            <Stack direction="row" spacing={1}>
              <Input
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
              <IconButton size="small" onClick={handleUpdate} sx={{ color: "lightblue" }}>
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setEditValue(message.content);
                  setEditing(false);
                }}
                sx={{ color: "red" }}
              >
                <CloseIcon />
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
        sx={{ opacity: 0.9, width: "100%", justifyContent: isMe ? "flex-end" : "flex-start" }}
      >
        {isMe && (
          <>
            <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ color: "white", p: 0.3, pr: 0.75 }} disabled={editing}>
              <Settings />
            </IconButton>
            <Popover
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: { backgroundColor: "#1e1e1e", minWidth: 200, padding: "5px 0", border: "1px solid #444" },
              }}
            >
              <Stack spacing={1}>
                <MenuItem
                  onClick={() => {
                    setEditing(true);
                    setEditValue(message.content);
                    setMenuAnchor(null);
                  }}
                  sx={{ display: "flex", justifyContent: "space-between", color: "white" }}
                >
                  Update <Edit sx={{ color: "lightblue", height: 20 }} />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDelete();
                    setMenuAnchor(null);
                  }}
                  sx={{ display: "flex", justifyContent: "space-between", color: "white" }}
                >
                  Delete <Delete sx={{ color: "red", height: 20 }} />
                </MenuItem>
              </Stack>
            </Popover>
          </>
        )}

        <ReactionPanel entityType="message" entityId={message.id} isSelf={isMe} direction="right" />

        <Stack direction="row" alignItems="center" spacing={0.3}>
          <IconButton size="small" onClick={handleToggleLike} sx={{ p: 0.3 }}>
            {likeIcon}
          </IconButton>
          <Typography fontSize={13} color={likeColor}>
            {likes.length}
          </Typography>
        </Stack>

        {readCount > 0 && (
          <>
            <Stack direction="row" alignItems="center" spacing={0.3} ml={1}>
              <IconButton size="small" onClick={(e) => setReadsAnchor(e.currentTarget)} sx={{ p: 0.3 }}>
                <VisibilityIcon sx={{ height: 25, color: "lightblue" }} />
              </IconButton>
              <Typography fontSize={12} color="lightblue">
                {readCount}
              </Typography>
            </Stack>

            <Popover
              anchorEl={readsAnchor}
              open={Boolean(readsAnchor)}
              onClose={() => setReadsAnchor(null)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{
                sx: {
                  backgroundColor: "#1e1e1e",
                  width: 220,
                  p: 1,
                  border: "1px solid #444",
                },
              }}
            >
              <Stack spacing={1}>
                {message.reads?.map((r) => (
                  <Stack key={r.id} direction="row" alignItems="center" spacing={1}>
                    <Avatar src={r.user.avatarUrl} sx={{ width: 26, height: 26 }} />
                    <Box>
                      <Typography fontSize={13} color="white">
                        {r.user.firstName} {r.user.lastName}
                      </Typography>
                      <Typography fontSize={11} color="#aaa">
                        @{r.user.userName}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Popover>
          </>
        )}
      </Stack>
    </Box>
  );
}
