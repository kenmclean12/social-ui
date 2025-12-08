// styles.ts
export const dialogFooterStackStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  gap: "16px",
};

export const cancelButtonStyles = {
  color: "#ccc",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  transition: "background 0.2s",
  ":hover": { background: "#222" },
};

export const updateButtonStyles = {
  border: "1px solid lightblue",
  color: "lightblue",
  background: "transparent",
  cursor: "pointer",
  ":disabled": { opacity: 0.5, cursor: "not-allowed" },
};

export const stackContainerStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "8px",
};

export const textFieldStyles = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
  "& .MuiInputBase-input": { color: "#fff" },
};

export const switchStyles = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: "lightblue" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "lightblue" },
};

export const switchLabelStyles = {
  color: "#fff",
};
