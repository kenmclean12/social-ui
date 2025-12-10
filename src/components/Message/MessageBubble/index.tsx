import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  IconButton,
  TextField,
} from "@mui/material";
import {
  Close,
  Edit,
  Favorite,
  FavoriteBorder,
  Settings,
  Visibility,
} from "@mui/icons-material";
import { useAuth } from "../../../context";
import type { LikeResponseDto, MessageResponseDto } from "../../../types";
import {
  useLikeCreate,
  useLikeDelete,
  useMessageDelete,
  useMessageMarkRead,
  useMessageUpdate,
} from "../../../hooks";
import { ReactionPanel } from "../../ReactionPanel";
import { ProfileDialog } from "../../Profile";
import { PopoverMenu, PopoverMenuItem } from "../../PopoverMenu";
import { UserRow } from "../../User";
import {
  bottomRowContainerStyles,
  mainContainerStyles,
  messageContentStyles,
  messageEditTextFieldStyles,
  paperStyles,
  timestampSelfStyles,
  timestampStyles,
  topRowContainerStyles,
} from "./styles";
import { formatTimeLabel } from "../../../utils";

interface Props {
  message: MessageResponseDto;
  isSelf: boolean;
  dialog?: boolean;
}

const sentReadRequests = new Set<number>();

export function MessageBubble({ message, isSelf, dialog = false }: Props) {
  const { user } = useAuth();
  const [editing, setEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(message.content);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [likes, setLikes] = useState<LikeResponseDto[]>(message.likes || []);

  const { mutateAsync: createLike } = useLikeCreate();
  const { mutateAsync: removeLike } = useLikeDelete();
  const { mutateAsync: updateMessage } = useMessageUpdate();
  const { mutateAsync: deleteMessage } = useMessageDelete();
  const { mutateAsync: markRead } = useMessageMarkRead();

  const myLike = useMemo(
    () => likes.find((l) => l.userId === user?.id),
    [likes, user]
  );
  const hasRead = useMemo(
    () => message.reads?.find((r) => r.user.id === user?.id),
    [message.reads, user?.id]
  );

  useEffect(() => {
    if (!message || !user) return;
    if (message.sender.id === user.id) return;
    if (sentReadRequests.has(message.id)) return;
    if (hasRead) return;

    sentReadRequests.add(message.id);

    markRead({ messageId: message.id, userId: user.id });
  }, [hasRead, markRead, message, message.id, user, user?.id]);

  const handleToggleLike = async () => {
    if (isSelf) return;

    if (myLike) {
      await removeLike(myLike.id);
      setLikes((prev) => prev.filter((l) => l.id !== myLike.id));
    } else {
      const newLike = await createLike({
        userId: user?.id as number,
        messageId: message.id,
      });
      setLikes((prev) => [...prev, newLike]);
    }
  };

  const handleUpdate = async () => {
    await updateMessage({ id: message.id, dto: { content: editValue } });
    setEditing(false);
  };

  const readCount = message.reads?.length || 0;
  const timestamp = message.createdAt
    ? formatTimeLabel(new Date(message.createdAt))
    : "n/a";

  return (
    <Box
      sx={mainContainerStyles}
      alignItems={isSelf ? "flex-end" : "flex-start"}
      mb={dialog ? 0 : 2}
    >
      {!isSelf ? (
        <Stack
          sx={{
            ...topRowContainerStyles,
            cursor: dialog ? "default" : "pointer",
          }}
          onClick={() => setSelectedUserId(message.sender.id)}
        >
          <Avatar
            src={message.sender.avatarUrl}
            sx={{ width: 28, height: 28 }}
          />
          <Typography fontSize={13} color="#ccc">
            {message.sender.firstName} {message.sender.lastName}
          </Typography>
          <Typography sx={timestampStyles}>{timestamp}</Typography>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Typography sx={timestampSelfStyles}>{timestamp}</Typography>
        </Stack>
      )}
      <Stack
        direction="row"
        alignItems="flex-end"
        spacing={0.7}
        justifyContent={isSelf ? "flex-end" : "flex-start"}
        width="50%"
      >
        <Paper elevation={2} sx={paperStyles}>
          {editing ? (
            <Stack direction="row" alignItems="flex-start" spacing={1}>
              <TextField
                multiline
                maxRows={5}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                sx={messageEditTextFieldStyles}
              />
              <IconButton
                size="small"
                onClick={handleUpdate}
                sx={{ color: "lightblue" }}
              >
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
                <Close />
              </IconButton>
            </Stack>
          ) : (
            <Typography sx={messageContentStyles}>{message.content}</Typography>
          )}
        </Paper>
      </Stack>
      <Stack
        sx={{
          ...bottomRowContainerStyles,
          justifyContent: isSelf ? "flex-end" : "flex-start",
        }}
      >
        {isSelf && (
          <PopoverMenu
            trigger={
              <IconButton
                size="small"
                sx={{ color: "white" }}
                disabled={editing}
              >
                <Settings />
              </IconButton>
            }
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <PopoverMenuItem
              label="Update"
              closeOnSelect
              onClick={() => {
                setEditing(true);
                setEditValue(message.content);
              }}
            />
            <PopoverMenuItem
              label="Delete"
              closeOnSelect
              onClick={() => deleteMessage(message.id)}
            />
          </PopoverMenu>
        )}
        <ReactionPanel
          entityType="message"
          reactionEntries={message.reactions}
          entityId={message.id}
          isSelf={isSelf}
          direction="right"
        />
        <Stack direction="row" alignItems="center" spacing={0.3}>
          <IconButton size="small" onClick={handleToggleLike} sx={{ p: 0.3 }}>
            {myLike ? (
              <Favorite sx={{ height: 25, color: "lightblue" }} />
            ) : likes.length > 0 ? (
              <Favorite sx={{ height: 25, color: "#fff" }} />
            ) : (
              <FavoriteBorder sx={{ height: 25, color: "#fff" }} />
            )}
          </IconButton>
          <Typography color={myLike ? "lightblue" : "#fff"}>
            {likes.length}
          </Typography>
        </Stack>
        {readCount > 0 && (
          <Stack direction="row" alignItems="center" spacing={0.3} ml={1}>
            <PopoverMenu
              trigger={
                <IconButton size="small" sx={{ p: 0.3 }}>
                  <Visibility sx={{ height: 25, color: "lightblue" }} />
                </IconButton>
              }
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              width="300px"
            >
              {message.reads?.map((r) => (
                <UserRow
                  key={r.user.id}
                  user={r.user}
                  showUserName
                  onClick={(id) => setSelectedUserId(id)}
                />
              ))}
            </PopoverMenu>
            <Typography color="lightblue">{readCount}</Typography>
          </Stack>
        )}
      </Stack>
      {selectedUserId !== null && (
        <ProfileDialog
          open={true}
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </Box>
  );
}
