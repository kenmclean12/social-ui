import { useState } from "react";
import { IconButton, Button, Stack, TextField } from "@mui/material";
import { useAuth } from "../../../context";
import { usePostCreate } from "../../../hooks";
import { Add, Close } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import { textFieldStyles } from "../../../pages/styles";
import {
  closeIconButtonStyles,
  submitButtonStyles,
  uploadPhotoButtonStyles,
} from "./styles";
import { useMinioPresignUrl } from "../../../hooks/minio";

export function PostCreate() {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>("");
  const [contentUrl, setContentUrl] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string>("");
  const { mutateAsync: createPost, isPending } = usePostCreate();
  const { mutateAsync: getPresignedUrl } = useMinioPresignUrl();

  const handleClose = () => {
    setOpen(false);
    setTextContent("");
    setContentUrl("");
    setFilePreview("");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uniqueFileName = `${Date.now()}-${user?.id || "anon"}-${file.name}`;

    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const { uploadUrl, finalUrl } = await getPresignedUrl({
        fileName: uniqueFileName,
      });

      await fetch(uploadUrl, { method: "PUT", body: file });
      setContentUrl(finalUrl);
    } catch (err) {
      console.error("File upload failed", err);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!textContent && !contentUrl) return;

    await createPost({
      userId: user.id,
      textContent: textContent || undefined,
      contentUrl: contentUrl || undefined,
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
            sx={submitButtonStyles}
          >
            {isPending ? "Posting..." : "Submit"}
          </Button>
        }
      >
        <Stack spacing={2}>
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
            sx={uploadPhotoButtonStyles}
            disabled={!!contentUrl}
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
          {filePreview && (
            <Stack position="relative">
              {filePreview.startsWith("data:image") ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                />
              ) : (
                <video
                  src={filePreview}
                  style={{ width: "100%", maxHeight: 200 }}
                  controls
                />
              )}
              <IconButton
                onClick={() => {
                  setFilePreview("");
                  setContentUrl("");
                }}
                size="small"
                sx={closeIconButtonStyles}
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
