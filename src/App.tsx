import { Paper, Table, TableContainer } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import Body from "@/components/Body";
import FormRow from "@/components/FormRow";
import Head from "@/components/Head";
import Row from "@/components/Row";
import supabase from "@/supabese";
import type { Column, Row as RowType } from "@/types";

function App() {
  const [rows, setRows] = useState<RowType[]>([]);
  const [editRowIdx, setEditRowIdx] = useState<number | null>(null);
  const [filters, setFilters] = useState<Partial<Record<Column, string>>>({});

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

  const handleSearch = useCallback((column: Column, query: string) => {
    setFilters((prev) => ({ ...prev, [column]: query }));
  }, []);

  const [sort, setSort] = useState<{column: Column, order: string}>({ column: "index", order: "asc" });
  const handleSort = useCallback((column: Column, order: string) => {
      setSort({ column, order });
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        const itemValue = String(row[key as Column]).toLowerCase();
        const filterValue = String(value).toLowerCase();

        return itemValue.includes(filterValue);
      });
    }).sort((a, b) => {
        const { column, order } = sort;
        if (a[column] < b[column]) return order === "asc" ? -1 : 1;
        if (a[column] > b[column]) return order === "asc" ? 1 : -1;
        return 0;
    });
  }, [rows, filters, sort]);

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
        <Head onSearch={handleSearch} onSort={handleSort}/>
        <Body onDragEnd={handleCopy}>
          {filteredRows.map((row, index) =>
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
