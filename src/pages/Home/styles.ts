export const mainContainerStyles = {
  display: "flex",
  height: "100vh",
  width: "100vw",
  minWidth: "500px",
  backgroundColor: "black",
};

export const tabStyles = {
  flex: 1,
  color: "lightblue",
  fontWeight: 500,

  "&.Mui-selected": {
    color: "white",
    borderBottom: "3px solid lightblue",
  },
  "&:hover": {
    backgroundColor: "rgba(173, 216, 230, 0.08)",
  },
};

export const tabsStyles = {
  width: "100%",
  backgroundColor: "black",
  color: "white",
  borderBottom: "1px solid lightblue",
};

export const unreadCountContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 20,
  width: 20,
  color: "black",
  fontSize: "0.75rem",
  fontWeight: 700,
  borderRadius: "50%",
  backgroundColor: "lightblue",
};
