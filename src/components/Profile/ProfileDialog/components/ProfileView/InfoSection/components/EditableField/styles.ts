export const mainContainerStyles = {
  p: 1.5,
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(107, 182, 255, 0.3)",
  borderRadius: 1,
};

export const nonEditableMainContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  p: 1,
  borderRadius: 1,
};

export const labelStyles = {
  display: "block",
  color: "#888",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  mb: 0.5,
};

export const valueStyles = {
  color: "lightblue",
  fontSize: 14,
  fontWeight: 500,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const editButtonStyles = {
  ml: 1,
  color: "#666",
  "&:hover": { color: "#6BB6FF" },
};

export const errorTextStyles = {
  display: "block",
  color: "red",
  mt: 0.5,
  fontSize: 11,
};
