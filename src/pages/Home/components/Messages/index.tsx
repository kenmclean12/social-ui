import { useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../../../../context";
import { ChatWindow, Sidebar } from "./components";

export function Messages() {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <Box display="flex" flex={1} height="100%" width="100%" border="1px solid lightblue">
      <Sidebar
        userId={user?.id as number}
        selectedId={selectedId as number}
        onSelect={setSelectedId}
      />
      <Box flex={1} borderLeft="1px solid lightblue">
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
