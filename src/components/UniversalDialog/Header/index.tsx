import { DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { closeIconStyles } from "./styles";

interface Props {
  title: string;
  onClose: () => void;
}

export default function Header({ title, onClose }: Props) {
  return (
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1.5,
        fontSize: "19px",
        borderBottom: "1px solid #444",
      }}
    >
      {title}
      <IconButton onClick={onClose} sx={{ ...closeIconStyles }}>
        <Close />
      </IconButton>
    </DialogTitle>
  );
}
