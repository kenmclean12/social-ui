export const mainContainerStyles = {
  display: "flex",
  flexDirection: "row",
  flex: 1,
  minWidth: 0,
  maxWidth: 800,
  px: 2,
};

export const inputContainerStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  flex: 1,
  flexShrink: 1,
  minWidth: 200,
  maxWidth: 800,
  px: 2,
  position: "relative",
};

export const inputStyles = {
  height: "35px",
  width: "100%",
  minWidth: "300px",
  padding: "2px 16px 2px 16px",
  fontSize: "14px",
  color: "white",
  border: "1px solid white",
  borderRadius: 4,
  display: {
    xs: "none",
    sm: "block",
  },
};

export const clearIconStyles = {
  position: "absolute",
  right: 4,
  top: "50%",
  transform: "translateY(-50%)",
  color: "white",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  lineHeight: 1,
  display: {
    xs: "none",
    sm: "block",
  },
};

export const dropdownContainerStyles = {
  width: "100%",
  maxHeight: 300,
  marginTop: "4px",
  background: "#1e1e1e",
  border: "1px solid #444",
  borderTop: "none",
  overflowY: "auto",
};
