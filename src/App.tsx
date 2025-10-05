import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

import MainTable from "@/MainTable";

function App() {
  const [tab, setTab] = useState<number>(1);

  return (
    <Box height="100vh" overflow="hidden">
      <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} sx={{ borderBottom: "1px solid #515151" }}>
        <Tab label="Company One" value={1} />
        <Tab label="Company Two" value={2} />
        <Tab label="Company Three" value={3} />
      </Tabs>
      <MainTable tab={tab} key={tab} />
    </Box>
  );
}

export default App;
