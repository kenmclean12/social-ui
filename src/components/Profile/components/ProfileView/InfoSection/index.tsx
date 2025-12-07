import { Divider, Paper, Box } from "@mui/material";
import type { UserWithCountsResponseDto } from "../../../../../types";
import { useUserUpdate } from "../../../../../hooks";
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
        alignItems: "flex-start",
        height: "100%",
        p: 3,
        borderRadius: 2,
        backgroundColor: "black",
        color: "#fff",
        gap: 3,
        border: "1px solid #444"
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: 1,
              mb: 2,
            }}
          >
            Basic Info
          </Box>
          <Divider sx={{ backgroundColor: "#ccc" }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
            <EditableField
              label="Username"
              value={user.userName}
              isOwnUser={isOwnUser}
              maxLength={50}
              onSave={(v: string) => updateUser({ userName: v })}
            />

            <Box sx={{ flex: 1 }}>
              <EditableField
                label="First Name"
                value={user.firstName}
                isOwnUser={isOwnUser}
                maxLength={30}
                onSave={(v: string) => updateUser({ firstName: v })}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <EditableField
                label="Last Name"
                value={user.lastName}
                isOwnUser={isOwnUser}
                maxLength={30}
                onSave={(v: string) => updateUser({ lastName: v })}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ backgroundColor: "#ccc" }}
      />
      <Box sx={{ flex: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: 1,
              mb: 2,
            }}
          >
            Contact & Details
          </Box>
          <Divider sx={{ backgroundColor: "#ccc" }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
            <EditableField
              label="Email"
              value={user.email}
              isOwnUser={isOwnUser}
              maxLength={100}
              onSave={(v: string) => updateUser({ email: v })}
              isEmail
            />
            <EditableField
              label="Phone"
              value={user.phoneNumber || ""}
              isOwnUser={isOwnUser}
              maxLength={11}
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
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
