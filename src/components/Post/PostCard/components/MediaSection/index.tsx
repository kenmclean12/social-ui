import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { emptyContainerStyles, mainContainerStyles } from "./styles";

type Status = "empty" | "loading" | "valid" | "invalid";

interface Props {
  url?: string;
  height?: number | string;
}

export function MediaSection({ url, height = 200 }: Props) {
  const mediaType = "image";
  const [status, setStatus] = useState<Status>(
    url && mediaType === "image" ? "loading" : "empty"
  );

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
    return <Box sx={{ ...emptyContainerStyles, height }} />;
  }

  return (
    <Box sx={{ ...mainContainerStyles, height }}>
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
