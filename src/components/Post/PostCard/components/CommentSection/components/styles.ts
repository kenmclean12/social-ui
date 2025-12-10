import { noCommentsDisplayContainerStyles } from "../styles";

export const contentContainerStyles = {
  padding: "12px",
  gap: "8px",
  backgroundColor: "black",
  border: "1px solid #444",
  borderRadius: "4px",
};

export const noRepliesContainerStyles = {
  ...noCommentsDisplayContainerStyles,
  backgroundColor: "black",
  padding: 4,
  paddingTop: 3,
};

export const chatBubbleStyles = {
  fontSize: 40,
  mb: 1,
  opacity: 0.5,
};

export const firstToReplyTextStyles = {
  alignSelf: "center",
  marginTop: "4px",
  opacity: 0.7,
};

export const repliesContainerStyles = {
  maxHeight: "300px",
  backgroundColor: "#121212",
  paddingTop: "4px",
  overflowY: "auto",
};

export const userTextStyles = {
  maxWidth: "45%",
  color: "white",
  fontSize: "13px",
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  cursor: "pointer",
};

export const timestampStyles = {
  flexShrink: 0,
  fontSize: "11px",
  color: "lightgrey",
  marginLeft: "4px",
};

export const contentTextStyles = {
  color: "white",
  paddingLeft: "32px",
  whiteSpace: "pre-wrap",
  lineHeight: 1.4,
};

export const settingsIconStyles = {
  color: "white",
  p: 0.5,
  fontSize: 25,
  cursor: "pointer",
};
