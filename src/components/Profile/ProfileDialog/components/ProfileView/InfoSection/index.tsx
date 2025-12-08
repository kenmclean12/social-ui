import { Divider, Paper, Box } from "@mui/material";
import type { UserWithCountsResponseDto } from "../../../../../../types";
import { useUserUpdate } from "../../../../../../hooks";
import { EditableField } from "./components";
import { basicInfoTextContainerStyles, contactDetailsTextContainerStyles, editableFieldContainerStyles, mainContainerStyles } from "./styles";

interface Props {
  user: UserWithCountsResponseDto;
  isOwnUser: boolean;
}

export function InfoSection({ user, isOwnUser }: Props) {
  const { mutateAsync: updateUser } = useUserUpdate();

  return (
    <Paper elevation={1} sx={mainContainerStyles}>
      <Box sx={{ flex: 1, width: "50%" }}>
        <Box sx={{ mb: 2, pt: 2 }}>
          <Box sx={basicInfoTextContainerStyles}>
            Basic Info
          </Box>
          <Divider sx={{ backgroundColor: "#ccc" }} />
          <Box sx={editableFieldContainerStyles}>
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
        sx={{ backgroundColor: "#ccc" }}
        flexItem
      />
      <Box sx={{ flex: 1, width: "50%", pt: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={contactDetailsTextContainerStyles}>
            Contact Details
          </Box>
          <Divider sx={{ backgroundColor: "#ccc" }} />
          <Box sx={editableFieldContainerStyles}>
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
              maxLength={12}
              onSave={(v: string) => updateUser({ phoneNumber: v })}
              isPhone
            />
            <EditableField
              label="Age"
              value={user.age?.toString()}
              isOwnUser={isOwnUser}
              maxLength={3}
              onSave={(v: string) => updateUser({ age: Number(v) })}
              isNumber
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
