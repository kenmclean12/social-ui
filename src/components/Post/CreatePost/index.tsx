import { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../context";
import { usePostCreate } from "../../../hooks";
import { ContentType } from "../../../types";

export function CreatePost() {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const { mutateAsync: createPost, isPending } = usePostCreate();

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setTextContent("");
    setAttachments([]);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const detectType = (file: File) => {
    if (file.type.startsWith("image/")) return ContentType.IMAGE;
    if (file.type.startsWith("video/")) return ContentType.VIDEO;
    if (file.type.startsWith("audio/")) return ContentType.AUDIO;
    return ContentType.FILE;
  };

  const handleSubmit = async () => {
    if (!user) return;

    const formatted = attachments.map((file) => ({
      type: detectType(file),
      data: file,
      filename: file.name,
    }));

    await createPost({
      userId: user.id,
      title,
      textContent,
      attachments: formatted,
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
            backgroundColor: "#1e1e1e",
            color: "white",
            border: "1px solid #444",
          },
        }}
      >
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Input
              fullWidth
              placeholder="Title"
              disableUnderline
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                background: "#2a2a2a",
                color: "white",
                px: 1.5,
                py: 1,
                borderRadius: 1,
                border: "1px solid #444",
              }}
            />
            <Input
              fullWidth
              placeholder="Write something..."
              disableUnderline
              multiline
              minRows={3}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              sx={{
                background: "#2a2a2a",
                color: "white",
                px: 1.5,
                py: 1,
                borderRadius: 1,
                border: "1px solid #444",
              }}
            />
            <Button
              component="label"
              variant="outlined"
              sx={{ borderColor: "#555", color: "white" }}
            >
              Add Attachments
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => handleFiles(e.target.files)}
              />
            </Button>
            {attachments.length > 0 && (
              <Stack spacing={1}>
                {attachments.map((file, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#2a2a2a",
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      border: "1px solid #444",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      {file.type.startsWith("image/") && (
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 4,
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {file.type.startsWith("video/") && (
                        <video
                          src={URL.createObjectURL(file)}
                          style={{ width: 70, borderRadius: 4 }}
                          muted
                        />
                      )}
                      {file.type.startsWith("audio/") && (
                        <Typography>{file.name} (audio)</Typography>
                      )}
                      {!file.type.startsWith("image/") &&
                        !file.type.startsWith("video/") &&
                        !file.type.startsWith("audio/") && (
                          <Typography>{file.name}</Typography>
                        )}
                    </Stack>
                    <IconButton
                      sx={{ color: "red" }}
                      onClick={() => removeAttachment(i)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isPending}
              sx={{ mt: 1 }}
            >
              {isPending ? "Posting..." : "Submit"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
