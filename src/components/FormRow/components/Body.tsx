import { Autocomplete, TextField } from "@mui/material";
import React from "react";

type Props = {
  value: [];
  onChange: (value: { bodies: string[] }) => void;
  options: string[];
};

function Body({ value, onChange, options }: Props) {
  return (
    <Autocomplete
      disablePortal
      autoSelect={true}
      autoHighlight={true}
      openOnFocus={true}
      size="small"
      multiple
      options={options}
      value={value}
      onChange={(_event, newValue) => {
        onChange({ bodies: newValue });
      }}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} placeholder="Body" fullWidth />
      )}
      disableCloseOnSelect
    />
  );
}

export default Body;
