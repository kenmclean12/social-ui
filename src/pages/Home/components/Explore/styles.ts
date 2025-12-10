export const mainContainerStyles = {
  position: "relative",
  height: "100%",
  width: "100%",
  paddingTop: "8px",
  boxSizing: "border-box",
  overflowY: "auto",
  "&::-webkit-scrollbar": { width: 8 },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#444",
    borderRadius: 4,
  },
};

export const exploreTopBarContainerStyles = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "12px 16px",
  marginBottom: "16px",
  border: "1px solid lightblue",
  borderRadius: "8px",
  backgroundColor: "black",
};

export const selectStyles = {
  maxWidth: 400,
  backgroundColor: "black",
  color: "white",
  ".MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#666",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#444",
  },
  ".MuiSvgIcon-root": { color: "white" },
};

export const paperPropStyles = {
  backgroundColor: "black",
  color: "white",
};

export const inputLabelStyles = {
  color: "white",
  "&.Mui-focused": { color: "white" },
};

export const gridContainerStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
  gap: "16px",
  padding: "8px",
  paddingTop: "0px",
};
