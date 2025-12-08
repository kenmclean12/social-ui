export const mainContainerStyles = {
  display: "flex",
  flex: 1,
  height: "100%",
  width: "100%",
  position: "relative",
};

export const innerContainerStyles = {
  transition: "width .2s ease",
  borderRight: "1px solid lightblue",
  position: "relative",
  overflow: "hidden",
  background: "#0b0b0b",
};

export const iconContainerStyles = {
  position: "absolute",
  top: 20,
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
};

export const iconButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "lightblue",
};

export const resizeHandleStyles = {
  width: "6px",
  cursor: "ew-resize",
  background: "transparent",
  position: "absolute",
  top: 0,
  bottom: 0,
  "&:hover": {
    background: "rgba(173,216,230,0.3)",
  },
};

export const selectConversationContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  color: "#999",
};
