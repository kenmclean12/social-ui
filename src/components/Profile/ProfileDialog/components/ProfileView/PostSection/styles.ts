export const mainContainerStyles = {
  padding: "8px",
  paddingInline: "4px",
  overflowY: "auto",
};

export const gridStyles = {
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(2, 1fr)",
  "@media (max-width: 1000px)": {
    gridTemplateColumns: "1fr",
  },
};

export const spinnerStyles = {
  alignSelf: "center",
  color: "lightblue",
};
