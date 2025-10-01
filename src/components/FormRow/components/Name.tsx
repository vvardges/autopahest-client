import { Autocomplete, TextField } from "@mui/material";
import React from "react";

type Props = {
    value: string;
    onChange: (value: {name: string}) => void;
    options: string[];
}

function Name({ value, onChange, options }: Props) {
  return (
    <Autocomplete
      disablePortal
      size="small"
      freeSolo
      options={options}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} placeholder={"Name"} fullWidth multiline />
      )}
      onChange={(_e, value) => onChange({ name: value as string })}
      inputValue={value}
      onInputChange={(_e, value) => onChange({ name: value })}
      filterSelectedOptions={false}
      includeInputInList={true}
    />
  )
}

export default Name;