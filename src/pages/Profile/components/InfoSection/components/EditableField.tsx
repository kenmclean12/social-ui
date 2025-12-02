import { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (v: string) => void;
  isOwnUser: boolean;
  isPhone?: boolean;
  isNumber?: boolean;
  isEmail?: boolean;
}

export function EditableField({
  label,
  value,
  onSave,
  isOwnUser,
  isPhone = false,
  isNumber = false,
  isEmail = false,
}: EditableFieldProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [temp, setTemp] = useState<string>(value);
  const [dirty, setDirty] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setTemp(value);
  }, [value]);

  useEffect(() => {
    setDirty(temp !== value);
    if (isEmail) {
      setError(temp !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(temp));
    }
  }, [temp, value, isEmail]);

  const formatPhoneNumber = (input: string) => {
    const digits = input.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleChange = (val: string) => {
    if (isPhone) {
      setTemp(formatPhoneNumber(val));
    } else {
      setTemp(val);
    }
  };

  const handleSave = () => {
    if (!dirty || error) return;
    onSave(temp);
    setEditing(false);
  };

  const handleCancel = () => {
    setTemp(value);
    setEditing(false);
    setError(false);
  };

  return (
    <Stack
      direction="row"
      alignSelf="center"
      alignItems="center"
      spacing={1}
      padding={editing ? 1 : 0}
      border={editing ? '1px solid #ccc' : 'none'}
      borderRadius={2}
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    >
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
          {isOwnUser && (
            <IconButton
              size="small"
              onClick={() => setEditing(true)}
              sx={{ color: "#6BB6FF" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            type={isNumber ? "number" : "text"}
            value={temp}
            onChange={(e) => handleChange(e.target.value)}
            error={error}
            variant="outlined"
            size="small"
            sx={{
              input: { height: "10px", color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: error ? "red" : "#6BB6FF" },
                "&:hover fieldset": { borderColor: error ? "red" : "#6BB6FF" },
                "&.Mui-focused fieldset": {
                  borderColor: error ? "red" : "#6BB6FF",
                },
              },
            }}
          />
          <IconButton
            size="small"
            onClick={handleSave}
            disabled={!dirty || error}
            sx={{
              color: dirty && !error ? "#6BB6FF" : "#555",
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
