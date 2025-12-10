import { useState, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth } from "../../../../context";
import { ChatWindow, Sidebar } from "./components";
import {
  iconButtonStyles,
  iconContainerStyles,
  innerContainerStyles,
  mainContainerStyles,
  resizeHandleStyles,
  selectConversationContainerStyles,
} from "./styles";

export function Messages() {
  const { user } = useAuth();
  const isResizing = useRef<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || collapsed) return;
    const newWidth = Math.min(Math.max(e.clientX, 250), 400);
    setSidebarWidth(newWidth);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", () => (isResizing.current = false));

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener(
        "mouseup",
        () => (isResizing.current = false)
      );
    };
  });

  return (
    <Box sx={mainContainerStyles}>
      <Box
        sx={{
          ...innerContainerStyles,
          width: collapsed ? "40px" : sidebarWidth,
        }}
      >
        <Box sx={iconContainerStyles}>
          <IconButton
            size="small"
            sx={iconButtonStyles}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
        {!collapsed && (
          <Sidebar
            userId={user?.id as number}
            selectedId={selectedId as number}
            onSelect={setSelectedId}
          />
        )}
      </Box>
      {!collapsed && (
        <Box
          onMouseDown={() => (isResizing.current = true)}
          sx={{
            ...resizeHandleStyles,
            left: sidebarWidth - 3,
          }}
        />
      )}
      <Box flex={1}>
        {selectedId ? (
          <ChatWindow conversationId={selectedId} />
        ) : (
          <Box sx={selectConversationContainerStyles}>
            Select a conversation
          </Box>
        )}
      </Box>
    </Box>
  );
}
