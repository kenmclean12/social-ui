export const paperStyles = {
  height: "100%",
  p: 2,
  backgroundColor: "black",
  border: "1px solid #444",
  borderRadius: 1,
  overflowY: "auto",
};

export const noCommentsDisplayContainerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  p: 11,
  color: "rgba(255, 255, 255, 0.5)",
};

export const sendButtonStyles = {
  height: "35px",
  backgroundColor: "black",
  border: "1px solid lightblue",
  color: "lightblue",

  "&:hover": {
    backgroundColor: "black",
    borderColor: "lightblue",
  },

  "&.Mui-disabled": {
    backgroundColor: "black !important",
    borderColor: "#333 !important",
    color: "#555 !important",
    cursor: "not-allowed",
    opacity: 1,
  },
};
