import React, {useState} from 'react'
import { CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import NewRow from "./NewRow.js";

const columns = [
  'Car Manufacturer', 'Car Model', 'Body Code', 'Name', 'Description',
  'Brand', 'Origin', 'Price', 'AM Article', 'OEM Article', 'Weight',
  'English', 'NMA Images', 'Actions'
]

const initialRows = [
  {
    'Car Manufacturer': 'Toyota',
    'Car Model': 'Corolla',
    'Body Code': 'E210',
    'Name': 'Front Bumper',
    'Description': 'OEM part',
    'Brand': 'Toyota',
    'Origin': 'Japan',
    'Price': '$250',
    'AM Article': 'AM12345',
    'OEM Article': 'OEM67890',
    'Weight': '5kg',
    'English': 'Front Bumper',
    'NMA Images': 3,
    'Actions': 'Edit/Delete'
  },
]

const darkTheme = createTheme({
  palette: { mode: 'dark' },
})

function App() {
  const [rows, setRows] = useState(initialRows);

  const handleAddRow = (row) => {
    setRows([...rows, row]);
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map(col => (
                  <TableCell key={col}>{row[col]}</TableCell>
                ))}
              </TableRow>
            ))}
            <NewRow onAdd={handleAddRow} />
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  )
}

export default App