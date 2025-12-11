import { textFieldStyles } from "../../../pages/styles";

export const mainContainerStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

export const paperStyles = {
  width: "fit-content",
  maxWidth: "90%",
  p: 1.3,
  background: "lightblue",
  color: "black",
  border: "2px solid black",
  borderRadius: 3,
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
};

export const topRowContainerStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
  marginBottom: "4px",
};

export const timestampStyles = {
  fontSize: "11px",
  color: "#aaa",
  userSelect: "none",
  pt: 0.25,
  whiteSpace: "nowrap",
};

export const timestampSelfStyles = {
  fontSize: "11px",
  color: "#aaa",
  userSelect: "none",
  pt: 0.25,
  whiteSpace: "nowrap",
};

export const messageContentStyles = {
  fontSize: "15px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const bottomRowContainerStyles = {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  marginTop: "1.6px",
  opacity: 0.9,
};

export const messageEditTextFieldStyles = {
  ...textFieldStyles,
  flex: 1,
  "& .MuiInputBase-input": {
    color: "white",
    padding: "8px 10px",
    lineHeight: 1.4,
  },
  "& .MuiOutlinedInput-root": {
    background: "#111",
    borderRadius: 2,
  },
};
