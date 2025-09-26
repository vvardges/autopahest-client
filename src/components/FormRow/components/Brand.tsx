import { Autocomplete, TextField } from "@mui/material";
import React from "react";

type Props = {
    value: string;
    onChange: (value: {brand: string}) => void;
}

function Brand({ value, onChange }: Props) {
  return (
    <Autocomplete
      size="small"
      freeSolo
      options={[]}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} placeholder={"Brand"} fullWidth />
      )}
      onChange={(_e, value) => onChange({ brand: value })}
      inputValue={value}
      onInputChange={(_e, value) => onChange({ brand: value })}
      filterSelectedOptions={false}
      includeInputInList={true}
      disableClearable={true}
    />
  )
}

export default Brand;