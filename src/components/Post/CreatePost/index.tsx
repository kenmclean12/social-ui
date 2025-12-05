import { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../../context";
import { usePostCreate } from "../../../hooks";

export function CreatePost() {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>("");
  const [contentUrl, setContentUrl] = useState<string>("");
  const { mutateAsync: createPost, isPending } = usePostCreate();

  const handleClose = () => {
    setOpen(false);
    setTextContent("");
    setContentUrl("");
  };

  const handleSubmit = async () => {
    if (!user) return;

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
            <Input
              fullWidth
              placeholder="Optional content URL..."
              disableUnderline
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
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
