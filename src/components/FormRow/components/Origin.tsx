import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const options = [
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
] as const;

type Props = {
    value: string;
    onChange: (value: {origin: string}) => void;
}

function Origin({ value, onChange }: Props) {
  return (
    <Autocomplete
      size="small"
      selectOnFocus
      options={options}
      value={value}
      onChange={(_event, newValue) => {
        onChange({ origin: newValue as string });
      }}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} placeholder="Origin" fullWidth/>
      )}
    />
  )
}

export default Origin;