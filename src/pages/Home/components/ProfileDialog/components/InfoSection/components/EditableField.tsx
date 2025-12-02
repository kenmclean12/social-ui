import { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (v: string) => void;
}

export function EditableField({ label, value, onSave }: EditableFieldProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [temp, setTemp] = useState<string>(value);
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    setTemp(value);
  }, [value]);

  useEffect(() => {
    setDirty(temp !== value);
  }, [temp, value]);

  const handleSave = () => {
    if (!dirty) return;
    onSave(temp);
    setEditing(false);
  };

  const handleCancel = () => {
    setTemp(value);
    setEditing(false);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography sx={{ color: "white", fontSize: 14, mb: 0.5 }}>
        {label}:
      </Typography>

      {!editing ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#6BB6FF",
            fontSize: 16,
          }}
        >
          <Typography sx={{ mr: 1 }}>{value || "—"}</Typography>
          <IconButton
            size="small"
            onClick={() => setEditing(true)}
            sx={{ color: "#6BB6FF" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#6BB6FF" },
                "&:hover fieldset": { borderColor: "#6BB6FF" },
                "&.Mui-focused fieldset": { borderColor: "#6BB6FF" },
              },
            }}
          />
          <IconButton
            size="small"
            onClick={handleSave}
            disabled={!dirty}
            sx={{
              color: dirty ? "#6BB6FF" : "#555",
              "&:disabled": { color: "#555" },
            }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleCancel} sx={{ color: "red" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Stack>
  );
}
