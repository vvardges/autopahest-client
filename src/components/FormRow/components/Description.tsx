import { TextField } from "@mui/material";
import React from "react";

type Props = {
  value: string;
  onChange: (arg0: string) => void;
};

function Description({ value, onChange }: Props) {
  return (
    <TextField
      size="small"
      placeholder="Enter value"
      multiline
      maxRows={4}
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  );
}
export default Description;
