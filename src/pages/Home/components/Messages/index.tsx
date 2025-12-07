import { useState, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth } from "../../../../context";
import { ChatWindow, Sidebar } from "./components";

export function Messages() {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [collapsed, setCollapsed] = useState(false);
  const isResizing = useRef(false);

  const MIN_WIDTH = 250;
  const MAX_WIDTH = 400;

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || collapsed) return;

    const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH);
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <Box display="flex" flex={1} height="100%" width="100%" position="relative">
      <Box
        sx={{
          width: collapsed ? "40px" : sidebarWidth,
          transition: "width .2s ease",
          borderRight: "1px solid lightblue",
          position: "relative",
          overflow: "hidden",
          background: "#0b0b0b"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 18,
            left: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "25px",
            width: "25px",
            zIndex: 20,
            background: "#111",
            border: "1px solid lightblue",
            borderRadius: "6px",
          }}
        >
          <IconButton
            size="small"
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: "lightblue" }}
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
          onMouseDown={handleMouseDown}
          sx={{
            width: "6px",
            cursor: "ew-resize",
            background: "transparent",
            position: "absolute",
            left: sidebarWidth - 3,
            top: 0,
            bottom: 0,
            "&:hover": { background: "rgba(173,216,230,0.3)" },
          }}
        />
      )}
      <Box flex={1}>
        {selectedId ? (
          <ChatWindow conversationId={selectedId} />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            color="#999"
          >
            Select a conversation
          </Box>
        )}
      </Box>
    </Box>
  );
}
