import type { ReactNode } from "react";
import { MenuItem, Typography, Box } from "@mui/material";
import { menuItemStyles } from "./styles";

interface Props {
  label: string;
  iconRight?: ReactNode;
  onClick?: () => void;
}

export function PopoverMenuItem({ label, iconRight, onClick }: Props) {
  return (
    <MenuItem onClick={onClick} sx={menuItemStyles}>
      <Typography>{label}</Typography>
      {iconRight && <Box>{iconRight}</Box>}
    </MenuItem>
  );
}
