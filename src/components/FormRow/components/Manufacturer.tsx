import { Autocomplete, TextField } from "@mui/material";

const options = ["bmw", "mercedes", "chevrolet", "ford", "hyundai", "kia", "jeep", "nissan", "toyota", "mazda", "lexus"];

type Props = {
    value: string;
    onChange: (value: {
        manufacturer: string;
        models: string[];
        bodies: string[];
    }) => void;
}

function Manufacturer({ value, onChange }: Props) {
  const handleChange = (value: string) => {
    onChange({
      manufacturer: value,
      models: [],
      bodies: [],
    });
  }
  return (
    <Autocomplete
      disablePortal
      size="small"
      autoSelect={true}
      autoHighlight={true}
      options={options}
      value={value}
      onChange={(_event, newValue) => handleChange(newValue as string)}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} placeholder="Manufacturer" fullWidth />
      )}
    />
  )
}

export default Manufacturer;