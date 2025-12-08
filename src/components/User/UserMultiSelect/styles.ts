export const formControlStyles = {};

export const inputLabelStyles = {
  color: "#aaa",
  "&.Mui-focused": {
    color: "#aaa !important",
  },
};

export const selectFieldStyles = {
  height: "50px",
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",

  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    border: "1px solid #444",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#444 !important",
  },

  "& .MuiSelect-select": {
    backgroundColor: "#1a1a1a !important",
    color: "#fff",
  },

  "& .MuiSvgIcon-root": {
    color: "#ccc",
  },
};

export const chipStyles = {
  background: "black",
  color: "#fff",
  border: "1px solid #444",
  height: "26px",
  "& .MuiChip-deleteIcon": {
    height: 17.5,
    color: "white",
  },
};

export const menuPaperStyles = {
  backgroundColor: "#1e1e1e",
  border: "1px solid #444",
  maxHeight: 250,
  padding: 0,
};

export const checkboxStyles = {
  padding: "4px",
  "& .MuiSvgIcon-root": {
    color: "#888",
  },
  "&.Mui-checked .MuiSvgIcon-root": {
    color: "lightblue",
  },
  "&.MuiCheckbox-root": {
    outline: "none",
    boxShadow: "none",
  },
};


export const extraCountStyles = {
  color: "#ccc",
  fontSize: "0.85rem",
  ml: "6px",
};
