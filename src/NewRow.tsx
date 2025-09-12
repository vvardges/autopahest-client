import {useMemo, useState} from "react";
import {Autocomplete, Button, createFilterOptions, TableCell, TableRow, TextField} from "@mui/material";

// @ts-ignore
import bmwData from "./data/bmw.json";
// @ts-ignore
import mercedesData from './data/mercedes.json';
import GoogleImagePicker from "./GoogleImagePicker";

const columns = [
  "Car Manufacturer", "Car Model", "Body Code", "Name", "Description",
  "Brand", "Price", "Origin",
  //  "AM Article", "OEM Article", "Weight",
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
  // "AM Article": "",
  // "OEM Article": "",
  // "Weight": "",
  "English": "",
  "NMA Images": "",
    "Actions": ""
};

const origins = [
    "China",
    "Germany",
    "Japan",
    "South Korea",
    "United States",
    "France",
    "Italy",
    "Spain",
    "United Kingdom",
    "Czech Republic",
    "Poland",
    "Romania",
    "Turkey",
    "India",
    "Thailand",
    "Malaysia",
    "Mexico",
    "Brazil",
    "Slovakia",
    "Hungary"
]

const NewRow = ({ onAdd, data }) => {
  const [form, setForm] = useState(initialState);
  const [open, setOpen] = useState(false);

  // Derive body codes based on selected models
  const bodyCodeOptions = useMemo(() => {
      let flat = form["Car Model"]
          .map(
              model =>
                  carData[form["Car Manufacturer"]].find(item => item.Model === model)?.Bodies.map(body => ({
                      label: body,
                      model: model,
                  })) || []
          ).flat();
      return flat;
  }, [form["Car Model"]]);

  // Handle change for single values
  const handleChange = field => event => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleAdd = () => {
    // @ts-ignore
      form["Body Code"] = form["Body Code"] ? form["Body Code"].map(body => body.label).join(", ") : [];
    onAdd?.(form);
    setForm(initialState);
  };

  return (
    <TableRow>
      {columns.map(col => {
        switch (col) {
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
                  sx={{ width: "200px"}}
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
                  groupBy={option => option.model}
                  value={form[col]}
                  onChange={(event, newValue) => {
                    setForm({ ...form, [col]: newValue || [] });
                  }}
                  sx={{ width: "200px"}}
                  fullWidth
                  disabled={form["Car Model"].length === 0}
                  renderInput={params => (
                    <TextField {...params} placeholder="Body" fullWidth />
                  )}
                  disableCloseOnSelect
                />
              </TableCell>
            );
        case "Name":
        case "Brand":
            return (
                <TableCell key={col} padding="none">
                    <Autocomplete
                        sx={{ width: "200px"}}
                        freeSolo
                        options={[...data[col]]}
                        fullWidth
                        renderInput={params => (
                            <TextField {...params} placeholder={col} fullWidth />
                        )}
                        onChange={(e, newValue) => {
                            setForm({ ...form, [col]: newValue || "" });
                        }}
                        inputValue={form[col]}
                        onInput={handleChange(col)}
                        filterSelectedOptions={false}
                        includeInputInList={true}
                    />
                </TableCell>
            );
        case "Description":
            return (
                <TableCell key={col} padding="none">
                    <TextField
                        sx={{ width: "200px"}}
                        label="Description"
                        multiline
                        maxRows={4}
                        onChange={handleChange(col)}
                        value={form[col]}
                    />
                </TableCell>
            )
          case "Price":
              return (
                  <TableCell key={col} padding="none">
                      <TextField
                          sx={{ width: "100px"}}
                          label="Price"
                          type="number"
                          onChange={handleChange(col)}
                          value={form[col]}
                      />
                  </TableCell>
              )
            case "Origin":
                return (
                    <TableCell key={col} padding="none">
                        <Autocomplete
                            sx={{ width: "200px"}}
                            selectOnFocus
                            options={origins}
                            value={form[col] || null}
                            onChange={(event, newValue) => {
                                setForm({ ...form, [col]: newValue || "" });
                            }}
                            fullWidth
                            renderInput={params => (
                                <TextField {...params} placeholder="Origin" fullWidth />
                            )}
                        />
                    </TableCell>
                )
          case "Actions":
            return (
              <TableCell key={col} padding="none">
                <Button onClick={handleAdd} size="large">
                  +
                </Button>
              </TableCell>
            );
          case "NMA Images":
              return (
                  <TableCell key={col} padding="none">
                      <Button onClick={() => setOpen(true)}>Select</Button>
                      {open && <GoogleImagePicker
                          onClose={() => setOpen((prevState) => !prevState)}
                          onSelect={url => {
                              setForm({ ...form, [col]: url });
                              setOpen(false);
                          }}
                          defaultValue={form["English"]}
                      />}
                  </TableCell>
              )
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

