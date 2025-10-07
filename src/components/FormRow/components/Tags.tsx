import { Autocomplete, Chip, TextField } from "@mui/material";
import React from "react";

type Props = {
  value: string[];
  onChange: (value: { tags: string[] }) => void;
  options: string[];
};

function Tags({ value, onChange, options }: Props) {
  return (
    <Autocomplete
      disableClearable
      disablePortal
      size="small"
      freeSolo
      multiple
      options={options}
      fullWidth
      value={value}
      renderInput={(params) => (
        <TextField {...params} placeholder={"Name"} fullWidth multiline />
      )}
      renderValue={(value: readonly string[]) =>
        value.map((option: string, index: number) => {
          return (
            <Chip
              variant="outlined"
              label={option}
              key={index}
              size="small"
              onDelete={() =>
                onChange({ tags: value.filter((v) => v !== option) })
              }
            />
          );
        })
      }
      onChange={(_e, value) => onChange({ tags: value as string[] })}
      filterSelectedOptions={false}
      includeInputInList={true}
    />
  );
}

export default Tags;
