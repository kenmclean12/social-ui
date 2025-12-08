import { useState } from "react";
import {
  IconButton,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { useAuth } from "../../../context";
import { usePostCreate } from "../../../hooks";
import { Add, Close } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import { textFieldStyles } from "../../../pages/styles";

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
          <Stack spacing={3}>
          <TextField
            fullWidth
            placeholder="Write something..."
            multiline
            minRows={3}
            value={textContent}
            inputProps={{ maxLength: 100 }}
            onChange={(e) => setTextContent(e.target.value)}
            sx={textFieldStyles}
          />
            <Button
              variant="outlined"
              component="label"
              disabled={!!contentUrl}
              sx={{
                border: "1px solid #444",
                color: "white",
                backgroundColor: "#1e1e1e",
              }}
              fullWidth
            >
              Upload File
              <input
                type="file"
                hidden
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </Button>
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
