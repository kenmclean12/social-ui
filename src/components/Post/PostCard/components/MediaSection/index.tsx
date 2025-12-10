import { useState, useEffect } from "react";
import { Box, Typography, Dialog, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  closeIconButtonStyles,
  dialogPaperStyles,
  emptyContainerStyles,
  mainContainerStyles,
} from "./styles";

type Status = "empty" | "loading" | "valid" | "invalid";

interface Props {
  url?: string;
  height?: number | string;
}

export function MediaSection({ url, height = 200 }: Props) {
  const mediaType = "image";
  const [open, setOpen] = useState<boolean>(false);
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
    <>
      <Box
        sx={{ ...mainContainerStyles, height, cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        {mediaType === "image" && (
          <img
            src={url}
            alt="Post media"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}
        {mediaType === "image" && status === "loading" && (
          <Typography color="white">Loading...</Typography>
        )}
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen
        PaperProps={{ sx: dialogPaperStyles }}
      >
        <IconButton onClick={() => setOpen(false)} sx={closeIconButtonStyles}>
          <Close />
        </IconButton>
        <img
          src={url}
          alt="Expanded media"
          style={{
            maxWidth: "95%",
            maxHeight: "95%",
            objectFit: "contain",
            borderRadius: "8px",
          }}
        />
      </Dialog>
    </>
  );
}
