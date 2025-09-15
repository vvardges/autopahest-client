import {
  CssBaseline,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { createTheme,ThemeProvider } from "@mui/material/styles"
import React, { useState } from "react"

import { COLUMNS } from "./constants";
import NewRow from "./NewRow";
import { useFillDown } from "./useFillDown"

const darkTheme = createTheme({
  palette: { mode: "dark" },
})

const label = { inputProps: { "aria-label": "Actions" } }

function App() {
  const {
    rows,
    setRows,
    startFill,
    onRowEnter,
    isRowInSelection,
    showHandle,
    fillHandleStyle,
  } = useFillDown({ columns: COLUMNS, initialRows:[], totalRows: 20 });

  const [editRowIdx, setEditRowIdx] = useState(null);

  const handleAddRow = (row) => {
    setEditRowIdx(null);
    setRows((prev) => prev.map((r) => (r.index === editRowIdx ? row : r)))
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {COLUMNS.map(col => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              editRowIdx === row.index ? (
                <NewRow
                  onAdd={handleAddRow}
                  key={row.index}
                  data={{
                    Name: new Set(rows.map(row => row.Name)),
                    Brand: new Set(rows.map(row => row.Brand))
                  }}
                  rowData={row}
                />
              ) :
                (<TableRow
                  key={row.index}
                  onMouseEnter={onRowEnter(row.index)}
                  sx={isRowInSelection(row.index) ? { backgroundColor: "rgba(100, 181, 246, 0.2)" } : undefined}
                  onDoubleClick={() => setEditRowIdx(row.index)}
                >
                  {COLUMNS.map(col => {
                    let content: React.ReactNode;
                    switch (col) {
                      case "NMA Images":
                        content =
                          row[col] ? (
                            <img
                              src={row[col]}
                              alt="NMA"
                              style={{ height: "50px", width: "50px", objectFit: "cover" }}
                            />
                          ) : (
                            row[col]
                          )
                        break
                      case "Actions":
                        content = <Switch {...label} defaultChecked />
                        break
                      default:
                        content = row[col]
                    }

                    return (
                      <TableCell key={col} sx={{ position: "relative", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                            {content}
                          </div>
                          {showHandle(col) && content && (
                            <span
                              title="Fill down"
                              onMouseDown={startFill(col, row.idx)}
                              style={fillHandleStyle}
                            >
                        +
                            </span>
                          )}
                        </div>
                      </TableCell>
                    )
                  })}
                </TableRow>)
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  )
}

export default App