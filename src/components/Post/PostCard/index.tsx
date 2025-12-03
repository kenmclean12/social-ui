import { useState } from "react";
import {
  Stack,
  Paper,
  Typography,
  Avatar,
  // Box,
  IconButton,
} from "@mui/material";
import {
  ThumbUp,
  ChatBubble,
  Favorite,
  // ArrowBackIos,
  // ArrowForwardIos,
} from "@mui/icons-material";
import { 
  // ContentType, 
  type PostResponseDto, 
} from "../../../types";
import { useUserFindOne } from "../../../hooks";

interface PostProps {
  post: PostResponseDto;
  width?: string | number;
  height?: string | number;
}

export function PostCard({ post, width = "100%", height = "auto" }: PostProps) {
  const [hover, setHover] = useState(false);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const { data: contents = [] } = useContentFindByPostId(post.id);
  // const { data: fileUrl } = useContentFile(1);
  // console.log(fileUrl)

  const { data: creator } = useUserFindOne(post.creatorId);

  // const nextContent = () => {
  //   if (currentIndex < contents.length - 1) setCurrentIndex(currentIndex + 1);
  // };

  // const prevContent = () => {
  //   if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  // };

  // const currentContent = contents[currentIndex];

  return (
    <Paper
      sx={{
        width,
        height,
        maxHeight: 600,
        p: 2,
        backgroundColor: "#1e1e1e",
        border: "1px solid #444",
        borderRadius: 2,
        cursor: "default",
        transition: "0.2s",
        "&:hover": { boxShadow: hover ? "0 0 15px lightblue" : "none" },
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={creator?.avatarUrl} />
          <Typography color="white" fontWeight="bold">
            {creator
              ? `${creator.firstName} ${creator.lastName}`
              : "Unknown User"}
          </Typography>
        </Stack>

        <Typography color="white">{post.title || ""}</Typography>
        <Typography color="white">{post.textContent || ""}</Typography>

        {/* <Box
          sx={{
            width: "100%",
            height: height === "auto" ? 400 : height,
            maxHeight: "400px",
            backgroundColor: "#333",
            borderRadius: 1,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading || !currentContent ? (
            <Box
              sx={{ width: "100%", height: "100%", backgroundColor: "#333" }}
            />
          ) : (
            <Box
              component={
                currentContent.type === ContentType.VIDEO ? "video" : "img"
              }
              src={fileUrl}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay={currentContent.type === ContentType.VIDEO}
              loop={currentContent.type === ContentType.VIDEO}
              muted={currentContent.type === ContentType.VIDEO}
            />
          )}

          {contents.length > 1 && (
            <>
              <IconButton
                onClick={prevContent}
                sx={{
                  position: "absolute",
                  left: 8,
                  color: "lightblue",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
                }}
                disabled={currentIndex === 0}
              >
                <ArrowBackIos fontSize="small" />
              </IconButton>
              <IconButton
                onClick={nextContent}
                sx={{
                  position: "absolute",
                  right: 8,
                  color: "lightblue",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
                }}
                disabled={currentIndex === contents.length - 1}
              >
                <ArrowForwardIos fontSize="small" />
              </IconButton>
            </>
          )}
        </Box> */}

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
        >
          <IconButton sx={{ color: "lightblue", gap: 1, fontSize: 15 }}>
            <ThumbUp /> {post.likeCount}
          </IconButton>
          <IconButton sx={{ color: "lightblue", gap: 1, fontSize: 15 }}>
            <ChatBubble /> {post.commentCount}
          </IconButton>
          <IconButton sx={{ color: "lightblue", gap: 1, fontSize: 15 }}>
            <Favorite /> {post.reactionCount}
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
