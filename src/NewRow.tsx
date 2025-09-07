import {useMemo, useState} from "react";
import {Autocomplete, Button, TableCell, TableRow, TextField} from "@mui/material";

import bmwData from "./data/bmw.json";
import mercedesData from "./data/mercedes.json";

const columns = [
  "Car Manufacturer", "Car Model", "Body Code", "Name", "Description",
  "Brand", "Origin", "Price", "AM Article", "OEM Article", "Weight",
  "English", "NMA Images", "Actions"
];

const carManufacturers = ["bmw", "mercedes"]; // TODO: Replace with real data

const carData = {
  bmw: bmwData,
  mercedes: mercedesData
}
// Extract model names for Autocomplete
const modelOptions = {
  bmw: carData.bmw.map(item => item.Model),
  mercedes: carData.mercedes.map(item => item.Model)
};

const initialState = {
  "Car Manufacturer": "",
  "Car Model": [],
  "Body Code": [],
  "Name": "",
  "Description": "",
  "Brand": "",
  "Origin": "",
  "Price": "",
  "AM Article": "",
  "OEM Article": "",
  "Weight": "",
  "English": "",
  "NMA Images": ""
};

const NewRow = ({ onAdd, data }) => {
  const [form, setForm] = useState(initialState);

  // Derive body codes based on selected models
  const bodyCodeOptions = useMemo(() => {
    return form["Car Model"]
        .map(
            model =>
                carData[form["Car Manufacturer"]].find(item => item.Model === model)?.Bodies || []
        ).flat();
  }, [form["Car Model"]]);

  // Handle change for single values
  const handleChange = field => event => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleAdd = () => {
    onAdd?.(form);
    setForm(initialState);
  };

  return (
    <TableRow>
      {columns.map(col => {
        switch (col) {
          case "Name":
          case "Brand":
            return (
              <TableCell key={col} padding="none">
                <Autocomplete
                  freeSolo
                  options={[...data[col]]}
                  value={form[col] || null}
                  onChange={(event, newValue) => {
                    setForm({ ...form, [col]: newValue || "" });
                  }}
                  fullWidth
                  renderInput={params => (
                      <TextField {...params} placeholder={col} fullWidth />
                  )}
                  autoSelect
                />
              </TableCell>
            );
          case "Car Manufacturer":
            return (
              <TableCell key={col} padding="none">
                <Autocomplete
                  options={carManufacturers}
                  value={form[col] || null}
                  onChange={(event, newValue) => {
                    setForm({ ...form, [col]: newValue || "" });
                  }}
                  fullWidth
                  renderInput={params => (
                    <TextField {...params} placeholder="Manufacturer" fullWidth />
                  )}
                />
              </TableCell>
            );
          case "Car Model":
            return (
              <TableCell key={col} padding="none">
                <Autocomplete
                  multiple
                  disabled={!form["Car Manufacturer"]}
                  options={modelOptions[form["Car Manufacturer"]]}
                  value={form[col]}
                  onChange={(event, newValue) => {
                    setForm({
                      ...form,
                      [col]: newValue || [],
                      // Reset body codes when models change
                      "Body Code": []
                    });
                  }}
                  sx={{ width: "300px"}}
                  fullWidth
                  renderInput={params => (
                    <TextField {...params} placeholder="Models" fullWidth />
                  )}
                  disableCloseOnSelect
                />
              </TableCell>
            );
          case "Body Code":
            return (
              <TableCell key={col} padding="none">
                <Autocomplete
                  multiple
                  options={bodyCodeOptions}
                  value={form[col]}
                  onChange={(event, newValue) => {
                    setForm({ ...form, [col]: newValue || [] });
                  }}
                  sx={{ width: "300px"}}
                  fullWidth
                  disabled={form["Car Model"].length === 0}
                  renderInput={params => (
                    <TextField {...params} placeholder="Body" fullWidth />
                  )}
                  disableCloseOnSelect
                />
              </TableCell>
            );
          case "Actions":
            return (
              <TableCell key={col} padding="none">
                <Button onClick={handleAdd} size="large">
                  +
                </Button>
              </TableCell>
            );
          default:
            return (
              <TableCell key={col} padding="none">
                <TextField
                  value={form[col] || ""}
                  onChange={handleChange(col)}
                  fullWidth
                  variant="outlined"
                  placeholder={col}
                />
              </TableCell>
            );
        }
      })}
    </TableRow>
  );
};

export default NewRow;

