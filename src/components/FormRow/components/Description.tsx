import { TextField } from "@mui/material";
import React from "react";

type Props = {
    value: string;
    onChange: (value: {description: string}) => void;
}

function Description({ value, onChange }: Props) {
  return (
    <TextField
      size="small"
      label="Description"
      multiline
      maxRows={4}
      onChange={(e) => onChange({ description: e.target.value })}
      value={value}
    />
  )
}
export default Description;