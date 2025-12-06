import { useState } from "react";
import { Stack, Tabs, Tab, Typography, Box } from "@mui/material";
import { ExploreFeed, Feed, Messages, TopBar } from "./components";
import { useUnreadMessageCount } from "../../hooks";

type Tab = "feed" | "messages" | "explore";

const tabStyles = {
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

export function HomePage() {
  const [tab, setTab] = useState<Tab>("feed");
  const { data: unreadCount } = useUnreadMessageCount();

  console.log(unreadCount);

  return (
    <Stack
      height="100vh"
      width="100vw"
      minWidth="500px"
      sx={{ backgroundColor: "black" }}
    >
      <TopBar />
      <Tabs
        value={tab}
        onChange={(_, val) => setTab(val)}
        textColor="inherit"
        variant="fullWidth"
        sx={{
          width: "100%",
          backgroundColor: "black",
          color: "white",
          borderBottom: "1px solid lightblue",
        }}
      >
        <Tab label="Feed" value="feed" sx={tabStyles} />
        <Tab
          value="messages"
          sx={tabStyles}
          label={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Messages</Typography>
              {typeof unreadCount === "number" && unreadCount > 0 && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={20}
                  width={20}
                  color="black"
                  fontSize="0.75rem"
                  fontWeight={700}
                  borderRadius="50%"
                  sx={{
                    backgroundColor: "lightblue",
                  }}
                >
                  {unreadCount}
                </Box>
              )}
            </Stack>
          }
        />
        <Tab label="Explore" value="explore" sx={tabStyles} />
      </Tabs>
      <Stack flexGrow={1}>
        {tab === "feed" && <Feed />}
        {tab === "messages" && <Messages />}
        {tab === "explore" && <ExploreFeed />}
      </Stack>
    </Stack>
  );
}
