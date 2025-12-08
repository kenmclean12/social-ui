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

export const startButtonStyles = {
  border: "1px solid lightblue",
  color: "lightblue",
  background: "transparent",
  cursor: "pointer",
};

export const autocompleteListboxStyles = {
  "& .MuiAutocomplete-option": {
    color: "#fff",
    "&.Mui-focused": { backgroundColor: "#1a1a1a" },
    "&.Mui-selected": { backgroundColor: "#1a1a1a" },
  },
};

export const autocompleteOptionStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const autocompleteCheckboxStyles = {
  marginLeft: "auto",
  color: "#fff",
  "&.Mui-checked": { color: "#fff" },
};

export const autocompleteRootStyles = {
  "& .MuiInputBase-root": {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: "8px",
    border: "1px solid #444",
  },
  "& .MuiSvgIcon-root": { color: "#ccc" },
  "& .MuiAutocomplete-tag": {
    backgroundColor: "#222",
    color: "#fff",
  },
};

export const stackContainerStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "8px",
};


export const autocompleteInputFieldStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    border: "1px solid #444",
    "&.Mui-focused": { borderColor: "lightblue" },
  },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
  "& .MuiInputBase-input": { color: "#fff" },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "lightblue" },
  "& .MuiInputLabel-root": { color: "#aaa" },
  "& .MuiInputLabel-root.Mui-focused": { color: "lightblue" },
};

export const autocompletePaperStyles = {
  maxHeight: "250px",
  overflowY: "auto",
  backgroundColor: "#1a1a1a",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "4px",
  marginTop: 0, // remove gap to connect dropdown to input
};

export const firstMessageFieldStyles = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": { borderColor: "#444" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
  "& .MuiOutlinedInput-root.Mui-focused": { borderColor: "lightblue" },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "lightblue" },
  "& .MuiInputBase-input": { color: "#fff" },
  "& .MuiInputLabel-root": { color: "#aaa" },
  "& .MuiInputLabel-root.Mui-focused": { color: "lightblue" },
};
