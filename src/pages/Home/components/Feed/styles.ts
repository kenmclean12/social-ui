export const mainContainerStyles = {
  position: "relative",
  height: "100%",
  width: "100%",
  padding: "16px",
  overflowY: "auto",
  "&::-webkit-scrollbar": { width: 8 },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#444",
    borderRadius: 4,
  },
};

export const postGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
  gap: "16px",
  padding: "8px",
};
