import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useConversationFindByUser } from "../../../../../../hooks";
import { StartConversationDialog } from "./StartConversationDialog";
import { SidebarItem } from "./SidebarItem";
import {
  sidebarContainerStyles,
  sidebarHeaderStyles,
  headerTitleStyles,
  addButtonIconStyles,
  sidebarListStyles,
  loadingTextStyles,
  emptyTextStyles,
} from "./styles";

interface Props {
  userId: number;
  selectedId: number;
  onSelect: Dispatch<SetStateAction<number | null>>;
}

export function Sidebar({ userId, selectedId, onSelect }: Props) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { data, isLoading } = useConversationFindByUser(userId);

  return (
    <Box sx={sidebarContainerStyles}>
      <Box sx={sidebarHeaderStyles}>
        <Typography sx={headerTitleStyles}>Conversations</Typography>
        <IconButton onClick={() => setOpenDialog(true)}>
          <AddIcon sx={addButtonIconStyles} />
        </IconButton>
      </Box>
      <Box sx={sidebarListStyles}>
        {isLoading ? (
          <Typography sx={loadingTextStyles}>Loading...</Typography>
        ) : (
          <>
            {data && data.length > 0 ? (
              data.map((c) => (
                <SidebarItem
                  key={c.id}
                  conversation={c}
                  selected={selectedId === c.id}
                  onClick={() => onSelect(c.id)}
                />
              ))
            ) : (
              <Typography sx={emptyTextStyles}>No Messages Found</Typography>
            )}
          </>
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
