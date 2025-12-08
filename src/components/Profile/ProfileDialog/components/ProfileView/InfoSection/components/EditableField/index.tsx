import { useState, useEffect } from "react";
import { Box, TextField, Typography, IconButton, Tooltip } from "@mui/material";
import { Check, Close, Edit } from "@mui/icons-material";
import {
  editButtonStyles,
  errorTextStyles,
  labelStyles,
  mainContainerStyles,
  nonEditableMainContainerStyles,
  valueStyles,
} from "./styles";
import { textFieldStyles } from "../../../../../../../../pages/styles";

interface Props {
  label: string;
  value: string;
  onSave: (v: string) => void;
  maxLength?: number;
  isOwnUser: boolean;
  isPhone?: boolean;
  isNumber?: boolean;
  isEmail?: boolean;
}

export function EditableField({
  label,
  value,
  onSave,
  maxLength,
  isOwnUser,
  isPhone = false,
  isNumber = false,
  isEmail = false,
}: Props) {
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
    if (isNumber && maxLength) {
      if (val.length > maxLength) return;
      setTemp(val);
      return;
    }

    if (isPhone) {
      const digits = val.replace(/\D/g, "");
      if (maxLength && digits.length > maxLength) return;
      setTemp(formatPhoneNumber(val));
      return;
    }

    if (maxLength && val.length > maxLength) return;

    setTemp(val);
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
          ...nonEditableMainContainerStyles,
          "&:hover": {
            backgroundColor: isOwnUser
              ? "rgba(255, 255, 255, 0.05)"
              : "transparent",
          },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" sx={labelStyles}>
            {label}
          </Typography>
          <Typography sx={valueStyles}>{value || "—"}</Typography>
        </Box>
        {isOwnUser && (
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => setEditing(true)}
              sx={editButtonStyles}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <Box sx={mainContainerStyles}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          type="text"
          inputMode={isNumber ? "numeric" : "text"}
          value={temp}
          onChange={(e) => handleChange(e.target.value)}
          error={error}
          variant="outlined"
          size="small"
          autoFocus
          fullWidth
          inputProps={{ maxLength }}
          sx={textFieldStyles}
        />
        <Tooltip title="Save">
          <IconButton
            size="small"
            onClick={handleSave}
            disabled={!dirty || error}
            sx={{
              color: dirty && !error ? "lightblue" : "#555",
              "&:disabled": { color: "#555", opacity: 0.5 },
            }}
          >
            <Check fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton
            size="small"
            onClick={handleCancel}
            sx={{ color: "#888" }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      {error && (
        <Typography variant="caption" sx={errorTextStyles}>
          Please enter a valid email address
        </Typography>
      )}
    </Box>
  );
}
