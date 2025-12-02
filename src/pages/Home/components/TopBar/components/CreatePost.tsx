import { useState } from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export function CreatePost() {
  const [open, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const handleClose = () => {
    setOpen(false);
    setContent("");
  };

  const handleSubmit = () => {
    console.log("Creating post:", content);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ color: "white" }}>
        <AddIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          <Typography>To be implemented</Typography>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}