import { Paper, Table, TableContainer } from "@mui/material";
import { useEffect, useState } from "react";

import Body from "@/components/Body";
import FormRow from "@/components/FormRow";
import Head from "@/components/Head";
import Row from "@/components/Row";
import supabase from "@/supabese";
import type { Row as RowType } from "@/types";

function App() {
  const [rows, setRows] = useState<RowType[]>([]);
  const [editRowIdx, setEditRowIdx] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("data")
      .select("json")
      .then((res) => {
        let data = [];
        if (res && res.data && res.data.length) {
          data = res.data[0].json;
        }
        setRows(data);
      });
  }, []);

  const handleEditRow = (index: number) => {
    setEditRowIdx(index);
  };

  const handleAddRow = (row: RowType) => {
    const updatedRows = [...rows].map((r) => (r.index === editRowIdx ? row : r));
    setRows(updatedRows);
    setEditRowIdx(null);
    handleSaveToDB(updatedRows);
  };

  const handleCancelEdit = () => {
    setEditRowIdx(null);
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = [...rows].filter((row) => row.index !== index);
    setRows(updatedRows);
    handleSaveToDB(updatedRows);
  };

  const handleCopy = <K extends keyof RowType>(start: number, end: number, columns: K[]) => {
    const newRows = [...rows];
    for (let i = start + 1; i <= end; i++) {
      for (const column of columns) {
        newRows[i][column] = rows[start][column];
      }
    }
    setRows(newRows);
    handleSaveToDB(newRows);
  };

  const handleSaveToDB = (jsonData: RowType[]) => {
    supabase
      .from("data")
      .update([{ json: jsonData }])
      .eq("id", 1)
      .then((res) => console.log(res));
  };

  return (
    <TableContainer component={Paper} sx={{ height: "100vh", overflow: "auto", width: "100%" }}>
      <Table
        size="small"
        stickyHeader
        sx={{
          tableLayout: "fixed",
          borderCollapse: "collapse",
          "& td, & th": {
            borderRight: "1px solid #515151",
          },
          "& td:last-child, & th:last-child": {
            borderRight: "none",
          },
        }}
      >
        <Head />
        <Body onDragEnd={handleCopy}>
          {rows.map((row, index) =>
            editRowIdx === row.index ? (
              <FormRow
                onAdd={handleAddRow}
                onCancel={handleCancelEdit}
                key={row.index}
                helperData={{
                  name: new Set(
                    rows.filter((row) => row.name.trim() !== "").map((row) => row.name),
                  ),
                  brand: new Set(
                    rows.filter((row) => row.brand.trim() !== "").map((row) => row.brand),
                  ),
                }}
                rowData={row}
              />
            ) : (
              <Row
                key={row.index}
                idx={index}
                row={row}
                onEdit={handleEditRow}
                onDelete={handleDeleteRow}
              />
            ),
          )}
        </Body>
      </Table>
    </TableContainer>
  );
}

export default App;
