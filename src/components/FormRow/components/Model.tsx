import { Autocomplete, TextField } from "@mui/material";
import React from "react";

type Props = {
    value: string[];
    onChange: (value: {
        models: string[];
        bodies: string[];
    }) => void;
    options: string[];
}

function Model({ value, onChange, options }: Props) {
  return (
    <Autocomplete
      disablePortal
      autoSelect={true}
      autoHighlight={true}
      openOnFocus={true}
      size="small"
      tabIndex={1}
      multiple
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