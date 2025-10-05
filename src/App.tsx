import { Paper, Tab, TableContainer, Tabs } from "@mui/material";
import { useState } from "react";

import MainTable from "@/MainTable";

function App() {
  const [tab, setTab] = useState<number>(1);

  return (
    <TableContainer
      component={Paper}
      sx={{ height: "100vh", overflow: "auto", width: "100%" }}
    >
      <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)}>
        <Tab label="Company One" value={1} />
        <Tab label="Company Two" value={2} />
        <Tab label="Company Three" value={3} />
      </Tabs>
      <MainTable tab={tab} key={tab} />
    </TableContainer>
  );
}

export default App;
