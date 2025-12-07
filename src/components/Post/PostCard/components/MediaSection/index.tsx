import { useState, useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  url?: string;
  height?: number | string;
}

export function MediaSection({ url, height = 200 }: Props) {
  const mediaType = useMemo<"image" | "video" | null>(() => {
    if (!url) return null;
    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.endsWith(".mp4")
    ) {
      return "video";
    }
    return "image";
  }, [url]);

  const [status, setStatus] = useState<
    "empty" | "loading" | "valid" | "invalid"
  >(url && mediaType === "image" ? "loading" : "empty");

  useEffect(() => {
    if (!url || mediaType !== "image") return;

    let cancelled = false;
    const img = new Image();
    img.src = url;
    img.onload = () => !cancelled && setStatus("valid");
    img.onerror = () => !cancelled && setStatus("invalid");

    return () => {
      cancelled = true;
    };
  }, [url, mediaType]);

  if (!url) {
    return (
      <Box
        sx={{
          width: "100%",
          height,
          backgroundColor: "#444",
          borderRadius: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          mt: 1,
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height,
        backgroundColor: "#444",
        borderRadius: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        mt: 1,
      }}
    >
      {mediaType === "video" && (
        <iframe
          width="100%"
          height="100%"
          src={
            url.includes("youtube") ? url.replace("watch?v=", "embed/") : url
          }
          title="Video"
          allowFullScreen
          style={{ border: "none" }}
        />
      )}

      {mediaType === "image" && (
        <img
          src={url}
          alt="Post media"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {mediaType === "image" && status === "invalid" && (
        <Typography color="white" fontSize={32}>
          ?
        </Typography>
      )}
      {mediaType === "image" && status === "loading" && (
        <Typography color="white">Loading...</Typography>
      )}
    </Box>
  );
}
