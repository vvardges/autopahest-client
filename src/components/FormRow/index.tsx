import {
  Close as CloseIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import {
  IconButton,
  Switch,
  TableCell,
  TableRow,
} from "@mui/material";
import {
  useEffect,
  useState,
} from "react";

import {
  Body,
  Brand,
  Default,
  Description,
  Images,
  Manufacturer,
  Model,
  Name,
  Origin,
  Price,
} from "@/components/FormRow/components";
import { COLUMNS } from "@/constants";
import type {Column, Row} from "@/types";
import {getColumnSx} from "@/helpers";

type DataDict = {
  Name: ReadonlyArray<string> | ReadonlySet<string>;
  Brand: ReadonlyArray<string> | ReadonlySet<string>;
};

type ModelOptions = {
  Model: string;
  Bodies: string[];
};

const FormRow = ({
  onAdd,
  rowData,
  onCancel
}: {
  onAdd?: (row: Row) => void;
  rowData: Row;
  onCancel?: () => void;
}) => {
  const [form, setForm] = useState<Row>(rowData);
  const [modelOptions, setModelOptions] = useState<ModelOptions[]>([]);

  // Handle change for single values
  const handleChange =
    (value: Partial<Row>) => setForm((prev) => ({
      ...prev,
      ...value,
    }));

  const handleSave = (data: Row) => {
    const payload: Row = {
      ...data,
    };
    onAdd?.(payload);
  };

  const manufacturer = form.manufacturer;
  useEffect(() => {
    if(!manufacturer) return;
    import(`../../data/${manufacturer}.json`).then(res => setModelOptions(res.default));
  }, [manufacturer]);

  return (
    <TableRow>
      {COLUMNS.map((col: Column) => (
        <TableCell padding="none" key={col} sx={getColumnSx(col)}>
          {(() => {
            switch (col as Column) {
              case "publish":
                return (
                  <Switch defaultChecked={false} disabled={true}/>
                );
              case "index":
                return rowData.index;
              case "manufacturer":
                return (
                  <Manufacturer
                    value={form.manufacturer as string}
                    onChange={handleChange}
                  />
                );
              case "models":
                return (
                  <Model
                    disabled={!form.manufacturer}
                    options={modelOptions.map(item => item.Model)}
                    onChange={handleChange}
                    value={form.models as []}
                  />
                );
              case "bodies":
                return (
                  <Body
                    value={form.bodies as []}
                    onChange={handleChange}
                    options={
                      modelOptions
                        .filter(option => form?.models?.includes(option.Model))
                        .map(option => option.Bodies).flat()
                    }
                    disabled={!form?.models?.length}
                  />
                );
              case "name":
                return (
                  <Name
                    value={form.name as string}
                    onChange={handleChange}
                  />
                );
              case "description":
                return (
                  <Description
                    value={form.description as string}
                    onChange={handleChange}
                  />
                );
              case "brand":
                return (
                  <Brand
                    value={form.brand as string}
                    onChange={handleChange}
                  />
                )
              case "price":
                return (
                  <Price
                    value={form.price as string}
                    onChange={handleChange}
                  />
                );
              case "origin":
                return (
                  <Origin
                    value={String(form.origin)}
                    onChange={handleChange}
                  />
                );
              case "images":
                return (
                  <Images
                    onSelect={(url: string) => {
                      setForm({ ...form, [col]: url } as Row);
                    }}
                    defaultValue={`${form.manufacturer} ${form.models} ${form.english}`.trim()}
                  />
                );
              case "actions":
                return (
                  <>
                    <IconButton
                      aria-label="Save"
                      size="small"
                      onClick={() => handleSave(form)}
                    >
                      <SaveIcon fontSize="small"/>
                    </IconButton>
                    <IconButton
                      aria-label="Cancel"
                      size="small"
                      onClick={onCancel}
                    >
                      <CloseIcon fontSize="small"/>
                    </IconButton>
                  </>
                );
              default:
                return (
                  <Default
                    value={form[col] as string}
                    onChange={(value) => handleChange({ [col]: value })}
                    placeholder={col}
                  />
                );
            }
          })()}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default FormRow;