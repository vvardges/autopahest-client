import { TextField } from "@mui/material";
import React from "react";

type Props = {
  value: string;
  onChange: (value: { price: string }) => void;
};

function Price({ value, onChange }: Props) {
  return (
    <TextField
      size="small"
      label="Price"
      type="number"
      onChange={(e) => onChange({ price: e.target.value })}
      value={value}
    />
  );
}

export default Price;
