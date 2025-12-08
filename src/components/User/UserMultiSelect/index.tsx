import {
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  Stack,
  Chip,
  Box,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  formControlStyles,
  inputLabelStyles,
  selectFieldStyles,
  chipStyles,
  menuPaperStyles,
  checkboxStyles,
  extraCountStyles,
} from "./styles";
import type { UserResponseDto } from "../../../types";
import { UserRow } from "../UserRow";

interface Props {
  data: UserResponseDto[];
  value: UserResponseDto[];
  label?: string;
  onChange: (users: UserResponseDto[]) => void;
}

export function UserMultiSelect({ data, value, onChange, label }: Props) {
  const selectedIds = value.map((v) => v.id);

  const removeUser = (id: number) => {
    onChange(value.filter((v) => v.id !== id));
  };

  const handleSelectChange = (ids: number[]) => {
    const next = data.filter((d) => ids.includes(d.id));
    onChange(next);
  };

  return (
    <FormControl fullWidth sx={formControlStyles}>
      {label && <InputLabel sx={inputLabelStyles}>{label}</InputLabel>}
      <Select
        multiple
        sx={selectFieldStyles}
        value={selectedIds}
        onChange={(e) => handleSelectChange(e.target.value as number[])}
        input={<OutlinedInput />}
        MenuProps={{
          PaperProps: { sx: menuPaperStyles },
        }}
        renderValue={(selected) => {
          if (!selected.length) return "";

          const first = value[0];
          if (selected.length === 1) {
            return (
              <Chip
                label={`@${first.userName}`}
                onDelete={() => removeUser(first.id)}
                onMouseDown={(e) => e.stopPropagation()}
                sx={chipStyles}
              />
            );
          }

          return (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                label={`@${first.userName}`}
                onDelete={() => removeUser(first.id)}
                onMouseDown={(e) => e.stopPropagation()}
                sx={chipStyles}
              />
              <Box sx={extraCountStyles}>+{selected.length - 1}</Box>
            </Stack>
          );
        }}
      >
        <Stack maxHeight="200px" sx={{ overflowY: "auto" }}>
          {data.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            const toggleUser = () => {
              if (isSelected) {
                handleSelectChange(selectedIds.filter((id) => id !== item.id));
              } else {
                handleSelectChange([...selectedIds, item.id]);
              }
            };

            return (
              <MenuItem
                key={item.id}
                value={item.id}
                onClick={toggleUser}
                sx={{ p: 0 }}
              >
                <UserRow
                  user={item}
                  button={
                    <Checkbox
                      checked={isSelected}
                      sx={checkboxStyles}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUser();
                      }}
                    />
                  }
                  color="#1e1e1e"
                  hoverColor="#444"
                />
              </MenuItem>
            );
          })}
        </Stack>
      </Select>
    </FormControl>
  );
}
