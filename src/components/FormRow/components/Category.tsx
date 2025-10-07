import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const options = [
  "Շարժիչի մասեր",
  "Դեղի կառավարման",
  "Վառելիքային համակարգեր",
  "Լուսավորում և օպտիկա",
  "Հովացման և տաքացման համակարգեր",
  "Թափքի մասեր",
  "Արգելակման համակարգեր",
  "Փոխանցման տուփ",
  "Ավտոսրահի մասեր",
  "Անվտանգություն",
  "Ընթացային մաս",
  "Արտանետման համակարգեր",
  "Էլեկտրական համակարգեր",
  "Ապակիներ",
  "Այլ",
] as const;

type Props = {
  value: string;
  onChange: (value: { category: string }) => void;
};

function Category({ value, onChange }: Props) {
  return (
    <Autocomplete
      disablePortal
      size="small"
      selectOnFocus
      options={options}
      value={value}
      onChange={(_event, newValue) => {
        onChange({ category: newValue as string });
      }}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} placeholder="Origin" fullWidth />
      )}
      disableClearable={true}
    />
  );
}

export default Category;
