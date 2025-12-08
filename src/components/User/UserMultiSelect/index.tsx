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
import type { FollowResponseDto } from "../../../types";
import { UserRow } from "../UserRow";

interface Props {
  data: FollowResponseDto[];
  value: FollowResponseDto[];
  label?: string;
  onChange: (users: FollowResponseDto[]) => void;
}

export function UserMultiSelect({ data, value, onChange, label }: Props) {
  const selectedIds = value.map((v) => v.following.id);

  const removeUser = (id: number) => {
    onChange(value.filter((v) => v.following.id !== id));
  };

  const handleSelectChange = (ids: number[]) => {
    const next = data.filter((d) => ids.includes(d.following.id));
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
                label={`@${first.following.userName}`}
                onDelete={() => removeUser(first.following.id)}
                onMouseDown={(e) => e.stopPropagation()}
                sx={chipStyles}
              />
            );
          }

          return (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                label={`@${first.following.userName}`}
                onDelete={() => removeUser(first.following.id)}
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
            const isSelected = selectedIds.includes(item.following.id);

            const toggleUser = () => {
              if (isSelected) {
                handleSelectChange(
                  selectedIds.filter((id) => id !== item.following.id)
                );
              } else {
                handleSelectChange([...selectedIds, item.following.id]);
              }
            };

            return (
              <MenuItem
                key={item.following.id}
                value={item.following.id}
                onClick={toggleUser}
                sx={{ p: 0 }}
              >
                <UserRow
                  user={item.following}
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
