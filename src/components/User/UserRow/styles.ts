export const paperStyles = {
  display: "flex",
  alignItems: "center",
  p: 1,
  backgroundColor: "black",
  transition: "background-color 0.15s ease",
  "&:hover": {
    backgroundColor: "#101",
  },
};

export const contentContainerStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "12px",
  flex: 1,
  minWidth: 0,
};
