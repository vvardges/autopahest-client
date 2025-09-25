import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const options = ["bmw", "mercedes"];

type Props = {
    value: string;
    onChange: (value: {
        manufacturer: string;
        models: string[];
        bodies: string[];
    }) => void;
}

function Manufacturer({ value, onChange }: Props) {
  return (
    <Autocomplete
      size="small"
      options={options}
      value={value}
      onChange={(_event, newValue) => {
        onChange({
          manufacturer: newValue as string,
          models: [],
          bodies: [],
        });
      }}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} placeholder="Manufacturer" fullWidth />
      )}
    />
  )
}

export default Manufacturer;