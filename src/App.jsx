import React, {useState} from 'react'
import { CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import NewRow from "./NewRow.js";

const columns = [
  'Car Manufacturer', 'Car Model', 'Body Code', 'Name', 'Description',
  'Brand', 'Price', 'Origin',
  //  'AM Article', 'OEM Article', 'Weight',
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
                  <TableCell key={col}>
                      {(col === "NMA Images" && row[col]) ? (
                          <img src={row[col]} alt="NMA" style={{height: '50px', width: '50px', objectFit: 'cover'}} />
                      ) : (
                        row[col]
                      )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <NewRow onAdd={handleAddRow} key={rows.length} data={{
              Name: new Set(rows.map(row => row.Name)),
              Brand: new Set(rows.map(row => row.Brand))
            }} />
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  )
}

export default App