import { Autocomplete, TextField } from "@mui/material";
import React from "react";

type Props = {
    value: [];
    onChange: (value: {bodies: string[]}) => void;
    options: string[];
    disabled: boolean;
}

function Body({ value, onChange, options, disabled }: Props) {
  return (
    <Autocomplete
      size="small"
      multiple
      options={options}
      value={value}
      onChange={(_event, newValue) => {
        onChange({ bodies: newValue });
      }}
      fullWidth
      disabled={disabled}
      renderInput={(params) => (
        <TextField {...params} placeholder="Body" fullWidth/>
      )}
      disableCloseOnSelect
    />
  )
}

export default Body;