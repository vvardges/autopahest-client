import {
  Autocomplete,
  Button,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";

import bmwData from "./data/bmw.json";
import mercedesData from "./data/mercedes.json";
import GoogleImagePicker from "./GoogleImagePicker.js";
import {COLUMNS} from "./constants";

// Types
type Manufacturer = "bmw" | "mercedes";

type CarItem = {
  Model: string;
  Bodies: string[];
};

type BodyOption = {
  label: string;
  model: string;
};

type FormState = {
  index: string;
  "Car Manufacturer": "" | Manufacturer;
  "Car Model": string[];
  "Body Code": BodyOption[];
  Name: string;
  Description: string;
  Brand: string;
  Origin: string;
  Price: string;
  English: string;
  "NMA Images": string;
  Actions: string;
};

type RowOut = Omit<FormState, "Body Code"> & {
  "Body Code": string;
};

type DataDict = {
  Name: ReadonlyArray<string> | ReadonlySet<string>;
  Brand: ReadonlyArray<string> | ReadonlySet<string>;
};

const carManufacturers: Manufacturer[] = ["bmw", "mercedes"]; // TODO: Replace with real data

const carData: Record<Manufacturer, CarItem[]> = {
  bmw: bmwData as CarItem[],
  mercedes: mercedesData as CarItem[]
};
// Extract model names for Autocomplete
const modelOptions: Record<Manufacturer, string[]> = {
  bmw: carData.bmw.map((item) => item.Model),
  mercedes: carData.mercedes.map((item) => item.Model)
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
  "Armenia",
  "India",
  "Thailand",
  "Malaysia",
  "Mexico",
  "Brazil",
  "Slovakia",
  "Hungary"
];

// Ensure incoming rowData matches the FormState shape for controlled components
function coerceRowDataToForm(rowData: Partial<RowOut> | undefined): FormState {
  const manufacturer = (rowData?.["Car Manufacturer"] ?? "") as FormState["Car Manufacturer"];

  // Coerce Car Model to an array of strings
  const carModelRaw = (rowData as any)?.["Car Model"];
  const carModel: string[] = Array.isArray(carModelRaw)
    ? carModelRaw
    : typeof carModelRaw === "string" && carModelRaw.length > 0
      ? [carModelRaw]
      : [];

  // Body Code in existing rows is stored as a string; for the multiple Autocomplete we need an array.
  // We can't reliably reconstruct the model grouping here, so start empty to avoid type issues.
  const bodyCode: BodyOption[] = [];

  return {
    ...(rowData as any),
    "Car Manufacturer": manufacturer,
    "Car Model": carModel,
    "Body Code": bodyCode
  };
}

const NewRow = ({
  onAdd,
  data,
  rowData
}: {
  onAdd?: (row: RowOut) => void;
  data: DataDict;
  rowData?: Partial<RowOut>;
}) => {
  const [form, setForm] = useState<FormState>(coerceRowDataToForm(rowData));
  const [open, setOpen] = useState(false);

  // Derive body codes based on selected models
  const bodyCodeOptions: BodyOption[] = useMemo(() => {
    const manufacturer = form["Car Manufacturer"];
    if (!manufacturer || !form["Car Model"]) return [];
    return form["Car Model"]
      .map((model) => {
        const found = carData[manufacturer].find((item) => item.Model === model);
        return (found?.Bodies ?? []).map<BodyOption>((body) => ({
          label: body,
          model
        }));
      })
      .flat();
  }, [form]);

  // Handle change for single values
  const handleChange =
    (field: keyof FormState) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [field]: event.target.value } as FormState);
      };

  const handleAdd = () => {
    const payload: RowOut = {
      ...form,
      "Body Code": form["Body Code"].length
        ? form["Body Code"].map((b) => b.label).join(", ")
        : ""
    };
    onAdd?.(payload);
  };

  return (
    <TableRow>
      {COLUMNS.map((col) => {
        switch (col) {
          case "index":
            return (
              <TableCell key={col}>{rowData[col]}</TableCell>
            );
          case "Car Manufacturer":
            return (
              <TableCell key={col} padding="none">
                <Autocomplete<string, false, false, false>
                  options={carManufacturers}
                  value={form[col] || null}
                  onChange={(_event, newValue) => {
                    setForm({ ...form, [col]: (newValue as Manufacturer) || "" } as FormState);
                  }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Manufacturer" fullWidth />
                  )}
                />
              </TableCell>
            );
          case "Car Model":
            return (
              <TableCell key={col} padding="none">
                <Autocomplete<string, true, false, false>
                  multiple
                  disabled={!form["Car Manufacturer"]}
                  options={
                    form["Car Manufacturer"]
                      ? modelOptions[form["Car Manufacturer"]]
                      : []
                  }
                  value={form[col]}
                  onChange={(_event, newValue) => {
                    setForm({
                      ...form,
                      [col]: newValue || [],
                      // Reset body codes when models change
                      "Body Code": []
                    } as FormState);
                  }}
                  sx={{ width: "200px" }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Models" fullWidth />
                  )}
                  disableCloseOnSelect
                />
              </TableCell>
            );
          case "Body Code":
            return (
              <TableCell key={col} padding="none">
                <Autocomplete<BodyOption, true, false, false>
                  multiple
                  options={bodyCodeOptions}
                  groupBy={(option) => option.model}
                  value={form[col]}
                  onChange={(_event, newValue) => {
                    setForm({ ...form, [col]: newValue || [] } as FormState);
                  }}
                  sx={{ width: "200px" }}
                  fullWidth
                  disabled={form["Car Model"].length === 0}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Body" fullWidth />
                  )}
                  disableCloseOnSelect
                  getOptionLabel={(opt) => opt.label}
                />
              </TableCell>
            );
          case "Name":
          case "Brand":
            return (
              <TableCell key={col} padding="none">
                <Autocomplete<string, false, false, true>
                  sx={{ width: "200px" }}
                  freeSolo
                  options={Array.from(data[col])}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} placeholder={col} fullWidth />
                  )}
                  onChange={(_e, newValue) => {
                    setForm({ ...form, [col]: newValue || "" } as FormState);
                  }}
                  inputValue={form[col]}
                  onInputChange={(_e, value) => {
                    setForm({ ...form, [col]: value } as FormState);
                  }}
                  filterSelectedOptions={false}
                  includeInputInList={true}
                />
              </TableCell>
            );
          case "Description":
            return (
              <TableCell key={col} padding="none">
                <TextField
                  sx={{ width: "200px" }}
                  label="Description"
                  multiline
                  maxRows={4}
                  onChange={handleChange(col)}
                  value={form[col]}
                />
              </TableCell>
            );
          case "Price":
            return (
              <TableCell key={col} padding="none">
                <TextField
                  sx={{ width: "100px" }}
                  label="Price"
                  type="number"
                  onChange={handleChange(col)}
                  value={form[col]}
                />
              </TableCell>
            );
          case "Origin":
            return (
              <TableCell key={col} padding="none">
                <Autocomplete<string, false, false, false>
                  sx={{ width: "200px" }}
                  selectOnFocus
                  options={origins}
                  value={form[col] || null}
                  onChange={(_event, newValue) => {
                    setForm({ ...form, [col]: newValue || "" } as FormState);
                  }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Origin" fullWidth />
                  )}
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
          case "NMA Images":
            return (
              <TableCell key={col} padding="none">
                <Button onClick={() => setOpen(true)}>Select</Button>
                {open && (
                  <GoogleImagePicker
                    onClose={() => setOpen((prevState) => !prevState)}
                    onSelect={(url: string) => {
                      setForm({ ...form, [col]: url } as FormState);
                      setOpen(false);
                    }}
                    defaultValue={form["English"]}
                  />
                )}
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

