import { useState } from "react";
import {
  Paper,
  Typography,
  IconButton,
  TextField,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useUserUpdate } from "../../../../../hooks";

interface DescriptionSectionProps {
  description: string;
  isOwnUser: boolean;
}

export function DescriptionSection({
  description,
  isOwnUser,
}: DescriptionSectionProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const { mutateAsync: update } = useUserUpdate();
  const dirty = value !== description;

  const startEditing = () => {
    setValue(description ?? "");
    setEditing(true);
  };

  const handleSave = () => {
    if (!dirty) return;

    update(
      { description: value },
      {
        onSuccess: () => {
          setEditing(false);
        },
      }
    );
  };

  return (
    <>
      <Divider sx={{ borderColor: "#333" }} />
      <Paper
        elevation={1}
        sx={{
          p: 2,
          backgroundColor: "#1e1e1e",
          color: "#fff",
          position: "relative",
        }}
      >
        {isOwnUser && !editing && (
          <IconButton
            size="small"
            onClick={startEditing}
            sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
          >
            <EditIcon />
          </IconButton>
        )}
        {editing ? (
          <Stack spacing={2}>
            <TextField
              multiline
              fullWidth
              minRows={3}
              maxRows={10}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              sx={(theme) => ({
                "& .MuiInputBase-input": {
                  color: theme.palette.primary.light,
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#111",
                  borderRadius: "6px",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.25)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.35)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.light,
                    borderWidth: 2,
                  },
                },
              })}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                onClick={() => setEditing(false)}
                startIcon={<CloseIcon />}
                sx={{ color: "white" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={!dirty}
                startIcon={<CheckIcon />}
                sx={{
                  backgroundColor: dirty ? "lightblue" : "#555",
                  color: "#000",
                  "&:disabled": {
                    backgroundColor: "#333",
                    color: "#999",
                  },
                }}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Typography>
            <strong style={{ color: "#fff" }}>Description: </strong>
            <span style={{ color: "lightblue" }}>
              {description || "No description set."}
            </span>
          </Typography>
        )}
      </Paper>
      <Divider sx={{ borderColor: "#333" }} />
    </>
  );
}
