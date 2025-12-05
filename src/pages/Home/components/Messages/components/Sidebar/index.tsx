import {
  Box,
  IconButton,
  List,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useConversationFindByUser } from "../../../../../../hooks";
import { StartConversationDialog } from "./StartConversationDialog";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  userId: number;
  selectedId: number;
  onSelect: Dispatch<SetStateAction<number | null>>;
}

export function Sidebar({ userId, selectedId, onSelect }: SidebarProps) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { data, isLoading } = useConversationFindByUser(userId);

  return (
    <Box width={320} height="100%" display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        borderBottom="1px solid #ddd"
      >
        <Typography variant="h6" color="white">Messages</Typography>

        <IconButton onClick={() => setOpenDialog(true)}>
          <AddIcon sx={{ color: "lightblue" }} />
        </IconButton>
      </Box>
      <Box flex={1} overflow="auto">
        {isLoading ? (
          <Typography px={2} py={2} color="gray">Loading...</Typography>
        ) : (
          <List disablePadding>
            {data && data.length > 0 ? data.map((c) => (
              <SidebarItem
                key={c.id}
                conversation={c}
                selected={selectedId === c.id}
                onClick={() => onSelect(c.id)}
              />
            )) : (
              <Typography align="center" p={3} color="white" fontSize={13}>
                No Messages Found
              </Typography>
            )}
          </List>
        )}
      </Box>
      <StartConversationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        userId={userId}
      />
    </Box>
  );
}
