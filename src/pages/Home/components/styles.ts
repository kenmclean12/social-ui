export const noPostContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
};

export const arrowUpwardButtonStyles = {
  position: "fixed",
  top: 120,
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "black",
  border: "1px solid lightblue",
  color: "lightblue",
  "&:hover": { backgroundColor: "black" },
  zIndex: 1000,
};
