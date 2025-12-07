import type { ReactNode } from "react";
import { Dialog } from "@mui/material";
import Header from "./Header";
import { Content } from "./Content";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  loading?: boolean;
  hasContent?: boolean;
  emptyMessage?: string;
  maxWidth?: "sm" | "md";
}

export function UniversalDialog({
  open,
  onClose,
  title = "",
  children,
  loading = false,
  hasContent = true,
  emptyMessage = "No content found",
  maxWidth = "sm",
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "black",
          border: "1px solid #444",
          color: "white",
          borderRadius: 2,
        },
      }}
    >
      {title && <Header title={title} onClose={onClose} />}
      <Content
        display={hasContent}
        loading={loading}
        emptyMessage={emptyMessage}
      >
        {children}
      </Content>
    </Dialog>
  );
}
