import { useState } from "react";
import { Stack, Tabs, Typography, Box, Tab } from "@mui/material";
import { ExploreFeed, Feed, Messages, TopBar } from "./components";
import { useUnreadMessageCount } from "../../hooks";
import {
  mainContainerStyles,
  tabsStyles,
  tabStyles,
  unreadCountContainerStyles,
} from "./styles";
import { HomePageTab } from "./types";

export function HomePage() {
  const [tab, setTab] = useState<HomePageTab>(HomePageTab.Feed);
  const { data: unreadCount } = useUnreadMessageCount();

  return (
    <Stack sx={mainContainerStyles}>
      <TopBar />
      <Tabs
        value={tab}
        onChange={(_, val) => setTab(val)}
        textColor="inherit"
        variant="fullWidth"
        sx={tabsStyles}
        TabIndicatorProps={{ style: { display: "none" } }}
      >
        <Tab label="Feed" value="feed" sx={tabStyles} />
        <Tab
          value="messages"
          label={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Messages</Typography>
              {typeof unreadCount === "number" && unreadCount > 0 && (
                <Box sx={unreadCountContainerStyles}>{unreadCount}</Box>
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
