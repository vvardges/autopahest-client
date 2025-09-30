import { TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";

import { COLUMNS } from "@/constants";
import { getColumnSx } from "@/helpers";
import { Column } from "@/types";

const getColumnLabel = (col: Column) => {
  switch (col) {
    case "index":
      return ""
    case "publish":
      return ""
    case "actions":
      return ""
    default:
      return col
  }
}

const Head = () => {
  return (
    <TableHead>
      <TableRow>
        {COLUMNS.map(col => (
          <TableCell
            padding="none"
            key={col}
            sx={{
              ...getColumnSx(col),
              zIndex: 3,
              paddingLeft: "5px",
              textTransform: "uppercase",
            }}
          >
            {getColumnLabel(col)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
};

export default Head;