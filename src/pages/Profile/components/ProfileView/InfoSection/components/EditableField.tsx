import { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton, Tooltip } from "@mui/material";
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

  if (!editing) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          borderRadius: 1,
          "&:hover": {
            backgroundColor: isOwnUser
              ? "rgba(255, 255, 255, 0.05)"
              : "transparent",
          },
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#888",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              color: "lightblue",
              fontSize: 14,
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value || "—"}
          </Typography>
        </Box>
        {isOwnUser && (
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => setEditing(true)}
              sx={{
                ml: 1,
                color: "#666",
                "&:hover": { color: "#6BB6FF" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(107, 182, 255, 0.3)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          type={isNumber ? "number" : "text"}
          value={temp}
          onChange={(e) => handleChange(e.target.value)}
          error={error}
          variant="outlined"
          size="small"
          fullWidth
          autoFocus
          sx={{
            "& .MuiOutlinedInput-root": {
              "& input": {
                color: "white",
                py: 0.75,
                fontSize: 14,
              },
              "& fieldset": {
                borderColor: error
                  ? "rgba(244, 67, 54, 0.5)"
                  : "rgba(107, 182, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: error
                  ? "rgba(244, 67, 54, 0.8)"
                  : "rgba(107, 182, 255, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: error ? "#f44336" : "#6BB6FF",
              },
            },
          }}
        />
        <Tooltip title="Save">
          <IconButton
            size="small"
            onClick={handleSave}
            disabled={!dirty || error}
            sx={{
              color: dirty && !error ? "#6BB6FF" : "#555",
              "&:disabled": { color: "#555", opacity: 0.5 },
            }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton
            size="small"
            onClick={handleCancel}
            sx={{ color: "#888" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      {error && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "#f44336",
            mt: 0.5,
            fontSize: 11,
          }}
        >
          Please enter a valid email address
        </Typography>
      )}
    </Box>
  );
}
