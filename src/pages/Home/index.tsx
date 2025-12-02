import { Stack, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { TopBar } from "./components";

type Tab = 'feed' | 'messages' | 'explore';

export function HomePage() {
  const [tab, setTab] = useState<Tab>('feed');

  return (
    <Stack height="100vh" width="100vw" sx={{ backgroundColor: "lightblue" }}>
      <TopBar />
      <Tabs
        value={tab}
        onChange={(_, val) => setTab(val)}
        sx={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Tab label="Feed" sx={{ width: "150px" }} />
        <Tab label="Messages" sx={{ width: "150px"}} />
        <Tab label="Explore" sx={{ width: "150px"}} />
      </Tabs>
      <Stack flexGrow={1} p={2}>
        {tab === 'feed' && <h1>Feed</h1>}
        {tab === 'messages' && <h1>Messages</h1>}
        {tab === 'explore' && <h1>Explore</h1>}
      </Stack>
    </Stack>
  );
}
