import { useState } from "react";
import { Stack, Tabs, Typography, Box, Tab } from "@mui/material";
import { ExploreFeed, Feed, Messages, TopBar } from "./components";
import { useUnreadMessageCount } from "../../hooks";
import { tabStyles } from "./styles";
import { HomePageTab } from "./types";

export function HomePage() {
  const [tab, setTab] = useState<HomePageTab>(HomePageTab.Feed);
  const { data: unreadCount } = useUnreadMessageCount();

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
          sx={tabStyles}
        />
        <Tab label="Explore" value="explore" sx={tabStyles} />
      </Tabs>
      <Stack height="85vh">
        {tab === HomePageTab.Feed && <Feed />}
        {tab === HomePageTab.Messages && <Messages />}
        {tab === HomePageTab.Explore && <ExploreFeed />}
      </Stack>
    </Stack>
  );
}
