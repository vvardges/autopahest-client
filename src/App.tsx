import { Paper, Table, TableContainer, } from "@mui/material"
import { useState } from "react"

import Body from "@/components/Body";
import FormRow from "@/components/FormRow";
import Head from "@/components/Head";
import Row from "@/components/Row";
import { COLUMNS } from "@/constants";
import type { Row as RowType } from "@/types";

const ROWS_LENGTH = 100;

// Create properly typed default rows
const createEmptyRow = (i: number): RowType => ({
  index: i + 1,
  publish: false,
  manufacturer: "",
  models: [],
  bodies: [],
  name: "",
  description: "",
  brand: "",
  price: "",
  origin: "",
  images: "",
  english: "",
  actions: "",
  amArticle: "",
  oemArticle: "",
  weight: ""
});

function App() {
  const [rows, setRows] = useState<RowType[]>(
    Array.from({ length: ROWS_LENGTH }, (_, i) => createEmptyRow(i))
  );

  const [editRowIdx, setEditRowIdx] = useState<number | null>(null);

  const handleEditRow = (index: number) => {
    setEditRowIdx(index);
  }

  const handleAddRow = (row: RowType) => {
    setRows((prev) => prev.map((r) => (r.index === editRowIdx ? row : r)));
    setEditRowIdx(null);
  }

  const handleCancelEdit = () => {
    setEditRowIdx(null);
  };

  const handleCopy = <K extends keyof RowType>(start: number, end: number, columnIndex: number) => {
    const column = COLUMNS[columnIndex] as K;
    const value = rows[start][column];
    const newRows = [...rows];
    for (let i = start + 1; i <= end; i++) {
      newRows[i][column] = value;
    }
    setRows(newRows);
  }

  return (
    <TableContainer component={Paper} sx={{ height: "100vh", overflow: "auto", width: "100%" }}>
      <Table size="small" stickyHeader sx={{ tableLayout: "fixed" }}>
        <Head />
        <Body onDragEnd={handleCopy}>
          {rows.map((row, index) => (
            editRowIdx === row.index ? (
              <FormRow
                onAdd={handleAddRow}
                onCancel={handleCancelEdit}
                key={row.index}
                // data={{
                //   name: new Set(rows.filter(row => row.name.trim() !== "").map(row => row.name)),
                //   brand: new Set(rows.filter(row => row.brand.trim() !== "").map(row => row.brand))
                // }}
                rowData={row}
              />
            ) :
              (
                <Row
                  key={row.index}
                  idx={index}
                  row={row}
                  onDoubleClick={handleEditRow}
                />
              )
          ))}
        </Body>
      </Table>
    </TableContainer>
  )
}

export default App