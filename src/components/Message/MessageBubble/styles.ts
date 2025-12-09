import { textFieldStyles } from "../../../pages/styles";

export const mainContainerStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

export const paperStyles = {
  maxWidth: "90%",
  width: "fit-content",
  p: 1.3,
  background: "black",
  border: "1px solid lightblue",
  color: "white",
  borderRadius: 3,
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
};

export const topRowContainerStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
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
