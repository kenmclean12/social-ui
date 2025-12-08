export const mainContainerStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  width: "100%",
  flex: 1,
  flexShrink: 1,
  minWidth: 200,
  maxWidth: 800,
  paddingLeft: 16,
  paddingRight: 16,
};

export const inputContainerStyles = {
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  width: "100%",
  flex: 1,
  flexShrink: 1,
  minWidth: 200,
  maxWidth: 800,
  paddingLeft: 16,
  paddingRight: 16,
};

export const userSearchInputStyles = {
  height: "35px",
  width: "100%",
  minWidth: "300px",
  padding: "2px 32px 2px 16px",
  fontSize: "14px",
  color: "white",
  border: "1px solid white",
  borderRadius: 4,
  display: {
    xs: "none",
    sm: "block",
  },
};

export const clearSearchButtonStyles = {
  position: "absolute",
  right: 1,
  top: "50%",
  transform: "translateY(-50%)",
  color: "white",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  lineHeight: 1,
};

export const dropdownMenuPaperStyles = {
  marginTop: "4px",
  width: "100%",
  maxHeight: 300,
  overflowY: "auto",
  background: "#1e1e1e",
  border: "1px solid #444",
  borderTop: "none",
};
