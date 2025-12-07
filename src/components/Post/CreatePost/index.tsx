import { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  Stack,
  InputAdornment,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../context";
import { usePostCreate } from "../../../hooks";

export function CreatePost() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [contentUrl, setContentUrl] = useState("");
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

  const clearFile = () => setFilePreview("");
  const clearUrl = () => setContentUrl("");

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
        <AddIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "black",
            color: "white",
            border: "1px solid #444",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          Create Post
          <CloseIcon
            onClick={() => setOpen(false)}
            sx={{ marginLeft: "auto", color: "red", cursor: "pointer" }}
          />
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
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
                      <IconButton onClick={clearUrl} size="small">
                        <CloseIcon sx={{ color: "white" }} />
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
                  onClick={clearFile}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                  }}
                >
                  <CloseIcon sx={{ color: "white", fontSize: 16 }} />
                </IconButton>
              </Stack>
            )}
            <Button
              variant="outlined"
              onClick={handleSubmit}
              disabled={isPending}
              sx={{
                mt: 1,
                border: "1px solid #444",
                color: "lightblue",
                backgroundColor: "black",
              }}
            >
              {isPending ? "Posting..." : "Submit"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
