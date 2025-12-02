import { Divider, Paper, Stack } from "@mui/material";
import type { UserWithCountsResponseDto } from "../../../../../../../types";
import { useUserUpdate } from "../../../../../../../hooks";
import { EditableField } from "./components";

interface InfoSectionProps {
  user: UserWithCountsResponseDto;
}

export function InfoSection({ user }: InfoSectionProps) {
  const { mutateAsync: updateUser } = useUserUpdate();

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        height: "100%",
        p: 2,
        backgroundColor: "#1e1e1e",
        color: "#fff",
        gap: 2,
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          height: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#1e1e1e",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#fff",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#ccc",
        },
      }}
    >
      <Stack flex="1 1 45%" spacing={0.5}>
        <EditableField
          label="Username"
          value={user.userName}
          onSave={(v: string) => updateUser({ userName: v })}
        />
        <EditableField
          label="First Name"
          value={user.firstName}
          onSave={(v: string) => updateUser({ firstName: v })}
        />
        <EditableField
          label="Last Name"
          value={user.lastName}
          onSave={(v: string) => updateUser({ lastName: v })}
        />
      </Stack>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ backgroundColor: "white" }}
      />
      <Stack flex="1 1 45%" spacing={0.5}>
        <EditableField
          label="Email"
          value={user.email}
          onSave={(v: string) => updateUser({ email: v })}
          isEmail
        />
        <EditableField
          label="Phone"
          value={user.phoneNumber || ""}
          onSave={(v: string) => updateUser({ phoneNumber: v })}
          isPhone
        />
        <EditableField
          label="Age"
          value={user.age?.toString()}
          onSave={(v: string) => updateUser({ age: Number(v) })}
          isNumber
        />
      </Stack>
    </Paper>
  );
}
