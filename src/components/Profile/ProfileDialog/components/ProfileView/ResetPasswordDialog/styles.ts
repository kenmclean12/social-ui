import { textFieldStyles } from "../../../../../../pages/styles";

export const buttonStyles = {
  border: "1px solid #444",
  color: "lightblue",
  backgroundColor: "black",
};

export const newTextFieldStyles = {
  ...textFieldStyles,
  "& .MuiInputBase-input": {
    height: "10px",
    color: "white",
  },
};
