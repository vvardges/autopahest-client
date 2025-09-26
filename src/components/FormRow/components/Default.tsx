import { TextField } from "@mui/material";
import React from "react";

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

function Default({ value, onChange, placeholder }: Props) {
  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      variant="outlined"
      placeholder={placeholder}
    />
  )
}

export default Default;