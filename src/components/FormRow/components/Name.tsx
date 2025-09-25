import { Autocomplete, TextField } from "@mui/material";
import React from "react";

type Props = {
    value: string;
    onChange: (value: {name: string}) => void;
}

function Name({ value, onChange }: Props) {
  return (
    <Autocomplete
      size="small"
      freeSolo
      options={[]}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} placeholder={"Name"} fullWidth multiline />
      )}
      onChange={(_e, value) => onChange({ name: value })}
      inputValue={value}
      onInputChange={(_e, value) => onChange({ name: value })}
      filterSelectedOptions={false}
      includeInputInList={true}
    />
  )
}

export default Name;