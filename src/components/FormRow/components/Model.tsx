import { Autocomplete, TextField } from "@mui/material";
import React from "react";

type Props = {
    value: string[];
    onChange: (value: {
        models: string[];
        bodies: string[];
    }) => void;
    options: string[];
    disabled: boolean;
}

function Model({ value, onChange, options, disabled }: Props) {
  return (
    <Autocomplete
      size="small"
      multiple
      disabled={disabled}
      options={options}
      value={value}
      onChange={(_event, newValue) => {
        onChange({
          models: newValue,
          bodies: []
        });
      }}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} placeholder="Models" fullWidth/>
      )}
      disableCloseOnSelect
    />
  )
}

export default Model;