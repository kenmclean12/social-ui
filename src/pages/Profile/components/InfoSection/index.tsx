import { Divider, Paper, Stack } from "@mui/material";
import type { UserWithCountsResponseDto } from "../../../../types";
import { useUserUpdate } from "../../../../hooks";
import { EditableField } from "./components";

interface InfoSectionProps {
  user: UserWithCountsResponseDto;
  isOwnUser: boolean;
}

export function InfoSection({ user, isOwnUser }: InfoSectionProps) {
  const { mutateAsync: updateUser } = useUserUpdate();

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        height: "100%",
        maxWidth: "600px",
        p: 2,
        backgroundColor: "#1e1e1e",
        color: "#fff",
        gap: 2,
      }}
    >
      <Stack flex="1 1 25%" spacing={isOwnUser ? 0 : .5}>
        <EditableField
          label="Username"
          value={user.userName}
          isOwnUser={isOwnUser}
          onSave={(v: string) => updateUser({ userName: v })}
        />
        <EditableField
          label="First Name"
          value={user.firstName}
          isOwnUser={isOwnUser}
          onSave={(v: string) => updateUser({ firstName: v })}
        />
        <EditableField
          label="Last Name"
          value={user.lastName}
          isOwnUser={isOwnUser}
          onSave={(v: string) => updateUser({ lastName: v })}
        />
      </Stack>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ backgroundColor: "white" }}
      />
      <Stack flex="1 1 25%" spacing={isOwnUser ? 0 : .5}>
        <EditableField
          label="Email"
          value={user.email}
          isOwnUser={isOwnUser}
          onSave={(v: string) => updateUser({ email: v })}
          isEmail
        />
        <EditableField
          label="Phone"
          value={user.phoneNumber || ""}
          isOwnUser={isOwnUser}
          onSave={(v: string) => updateUser({ phoneNumber: v })}
          isPhone
        />
        <EditableField
          label="Age"
          value={user.age?.toString()}
          isOwnUser={isOwnUser}
          onSave={(v: string) => updateUser({ age: Number(v) })}
          isNumber
        />
      </Stack>
    </Paper>
  );
}
