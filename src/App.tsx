import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

import MainTable from "@/MainTable";

function App() {
  const [tab, setTab] = useState<number>(1);

  return (
    <MainTable
      tab={tab}
      key={tab}
      tabsComponent={
        <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)}>
          <Tab label="Company One" value={1} />
          <Tab label="Company Two" value={2} />
          <Tab label="Company Three" value={3} />
        </Tabs>
      }
    />
  );
}

export default App;
