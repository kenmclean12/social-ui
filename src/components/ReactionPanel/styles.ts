export const triggerContainerStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  cursor: "pointer",
  borderRadius: 20,
  padding: "2px 8px",
  gap: "6px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
};

export const popoverStyles = {
  "& .MuiPopover-paper": {
    borderRadius: 2,
    overflow: "hidden",
  },
};

export const paperStyles = {
  width: 320,
  backgroundColor: "black",
  border: "1px solid #333",
};

export const reactWithTextStyles = {
  color: "rgba(255, 255, 255, 0.9)",
  mb: 1.5,
  fontSize: 12,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

export const emojiIconButtonStyles = {
  width: 36,
  height: 36,
  borderRadius: 1,
  color: "white",
  transition: "all 0.2s ease",
  transform: "scale(1.1)",
  "&.Mui-disabled": {
    opacity: 0.5,
  },
};

export const reactionContainerStyles = {
  maxHeight: 280,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#444",
    borderRadius: 3,
  },
};

export const emojiCountContainerStyles = {
  display: "flex",
  alignItems: "center",
  mb: 0.5,
  px: 1,
};

export const userListContainerStyles = {
  position: "relative",
  borderRadius: 1,
  mb: 0.5,
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    "& .remove-button": {
      opacity: 1,
    },
  },
};

export const closeIconStyles = {
  color: "red",
  fontSize: 16,
  cursor: "pointer",
};

export const noReactionsDisplayContainerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  p: 4,
  color: "rgba(255, 255, 255, 0.5)",
};
