import type { ReactNode } from "react";
import { Dialog, Stack } from "@mui/material";
import Header from "./Header";
import { Content } from "./Content";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  hasContent?: boolean;
  emptyMessage?: string;
  maxWidth?: "sm" | "md" | "lg";
}

export function UniversalDialog({
  open,
  onClose,
  title = "",
  children,
  footer,
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
          height: maxWidth === "lg" ? "90vh" : "auto",
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
        <Stack paddingInline={1} paddingBottom={footer ? 0 : 1.5}>
          {children}
        </Stack>
      </Content>
      {footer && (
        <Stack borderTop="1px solid #444" mt={2.5} pt={1.5} pb={1.5}>
          <Stack paddingInline={1}>{footer}</Stack>
        </Stack>
      )}
    </Dialog>
  );
}
