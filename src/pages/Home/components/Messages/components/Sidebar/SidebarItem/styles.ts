export const listItemButtonStyles = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #222",
  py: 1.5,
  color: "white",
  backgroundColor: "black",
  "&.Mui-selected": {
    backgroundColor: "#101 !important",
    "&:hover": {
      backgroundColor: "#101 !important",
    },
  },
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
};

export const contentContainerStyles = {
  position: "relative",
  width: 45,
  height: 35,
  ml: -1.25,
  cursor: "pointer",
};

export const unreadIndicatorContainerStyles = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: "lightblue",
  mr: 1.5,
};

export const popoverPaperStyles = {
  backgroundColor: "#1e1e1e",
  minWidth: 200,
  padding: "5px 0",
  border: "1px solid #444",
};

export const menuItemStyles = {
  display: "flex",
  justifyContent: "space-between",
  color: "white",
};

export const avatarStyles = {
  position: "absolute",
  left: 8,
  width: 30,
  height: 30,
  border: "2px solid #111",
  zIndex: 1,
};

export const avatarSecondaryStyles = {
  marginLeft: "4px",
  width: 35,
  height: 35,
  border: "2px solid #111",
  cursor: "pointer",
};

export const extraCountStyles = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  left: 24,
  width: 30,
  height: 30,
  borderRadius: "50%",
  border: "2px solid #111",
  bgcolor: "gray",
  color: "white",
  fontSize: 12,
  zIndex: 3,
  userSelect: "none",
};
