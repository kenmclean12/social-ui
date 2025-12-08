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
import { useUserUpdate } from "../../../../../../hooks";
import { Check, Close, Edit } from "@mui/icons-material";
import { textFieldStyles } from "../../../../../../pages/styles";
import { editButtonStyles, paperStyles } from "./styles";

interface Props {
  description: string;
  isOwnUser: boolean;
}

export function DescriptionSection({ description, isOwnUser }: Props) {
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
      <Paper elevation={1} sx={paperStyles}>
        {isOwnUser && !editing && (
          <IconButton size="small" onClick={startEditing} sx={editButtonStyles}>
            <Edit />
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
              sx={textFieldStyles}
            />
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                onClick={() => setEditing(false)}
                startIcon={<Close />}
                sx={{ color: "white" }}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                onClick={handleSave}
                startIcon={<Check />}
                sx={{
                  border: `1px solid ${dirty ? "lightblue" : "#555"}`,
                  color: "lightblue",
                }}
                disabled={!dirty}
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
