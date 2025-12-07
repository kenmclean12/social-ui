import { useState } from "react";
import {
  IconButton,
  Button,
  Input,
  Stack,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../context";
import { usePostCreate } from "../../../hooks";
import { Add, Close } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";

export function PostCreate() {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>("");
  const [contentUrl, setContentUrl] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string>("");
  const { mutateAsync: createPost, isPending } = usePostCreate();

  const handleClose = () => {
    setOpen(false);
    setTextContent("");
    setContentUrl("");
    setFilePreview("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setContentUrl("");
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentUrl(e.target.value);
    setFilePreview("");
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!textContent) return;

    await createPost({
      userId: user.id,
      textContent: textContent || undefined,
      contentUrl: filePreview || contentUrl || undefined,
    });

    handleClose();
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ color: "white" }}>
        <Add />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={handleClose}
        title="Create Post"
        footer={
          <Button
            variant="outlined"
            onClick={handleSubmit}
            disabled={isPending}
            sx={{
              border: "1px solid #444",
              color: "lightblue",
              backgroundColor: "black",
            }}
          >
            {isPending ? "Posting..." : "Submit"}
          </Button>
        }
      >
        <Stack spacing={2}>
          <Input
            fullWidth
            placeholder="Write something..."
            disableUnderline
            multiline
            minRows={3}
            value={textContent}
            inputProps={{ maxLength: 100 }}
            onChange={(e) => setTextContent(e.target.value)}
            sx={{
              background: "#1e1e1e",
              color: "white",
              px: 1.5,
              py: 1,
              borderRadius: 1,
              border: "1px solid #444",
            }}
          />
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              component="label"
              disabled={!!contentUrl}
              sx={{
                width: "45%",
                border: "1px solid #444",
                color: "white",
                backgroundColor: "#1e1e1e",
              }}
            >
              Upload File
              <input
                type="file"
                hidden
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </Button>
            <Typography
              align="center"
              width="10%"
              color="white"
              marginInline={1}
            >
              Or
            </Typography>
            <Input
              placeholder="YouTube Video URL..."
              disableUnderline
              fullWidth
              value={contentUrl}
              onChange={handleYoutubeChange}
              disabled={!!filePreview}
              endAdornment={
                contentUrl && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setContentUrl("")} size="small">
                      <Close sx={{ color: "white" }} />
                    </IconButton>
                  </InputAdornment>
                )
              }
              sx={{
                width: "45%",
                height: "35px",
                background: "#1e1e1e",
                color: "white",
                px: 1.5,
                py: 1,
                borderRadius: 1,
                border: "1px solid #444",
              }}
            />
          </Stack>
          {filePreview && (
            <Stack position="relative">
              {filePreview.startsWith("data:image") ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <video
                  src={filePreview}
                  style={{ width: "100%", maxHeight: 200 }}
                  controls
                />
              )}
              <IconButton
                onClick={() => setFilePreview("")}
                size="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                }}
              >
                <Close sx={{ color: "white", fontSize: 16 }} />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </UniversalDialog>
    </>
  );
}
