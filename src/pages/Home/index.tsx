import { Stack, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { ExploreFeed, Feed, Messages, TopBar } from "./components";

type Tab = "feed" | "messages" | "explore";

export function HomePage() {
  const [tab, setTab] = useState<Tab>("feed");

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

  return (
    <Stack
      height="100vh"
      width="100vw"
      minWidth="550px"
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
        <Tab label="Messages" value="messages" sx={tabStyles} />
        <Tab label="Explore" value="explore" sx={tabStyles} />
      </Tabs>
      <Stack flexGrow={1} p={2}>
        {tab === "feed" && <Feed />}
        {tab === "messages" && <Messages />}
        {tab === "explore" && <ExploreFeed />}
      </Stack>
    </Stack>
  );
}
