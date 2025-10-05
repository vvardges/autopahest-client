import { Close as CloseIcon, Save as SaveIcon } from "@mui/icons-material";
import { Button, IconButton, Switch, TableCell, TableRow } from "@mui/material";
import { useEffect, useRef, useState } from "react";

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
import { getColumnSx } from "@/helpers";
import type { Column, Row } from "@/types";

type ModelOptions = {
  Model: string;
  Bodies: string[];
};

const FormRow = ({
  onAdd,
  helperData,
  rowData,
  onCancel,
}: {
  onAdd: (row: Row) => void;
  helperData: {
    name: Set<string>;
    brand: Set<string>;
  };
  rowData: Row;
  onCancel?: () => void;
}) => {
  const [form, setForm] = useState<Row>(rowData);
  const [modelOptions, setModelOptions] = useState<ModelOptions[]>([]);
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  const ref = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onAdd(form);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [form, onAdd]);

  // Handle change for single values
  const handleChange = (value: Partial<Row>) =>
    setForm((prev) => ({
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
    if (!manufacturer) return;
    import(`../../data/${manufacturer}.json`).then((res) =>
      setModelOptions(res.default),
    );
  }, [manufacturer]);

  return (
    <TableRow ref={ref}>
      {COLUMNS.map((col: Column) => (
        <TableCell padding="none" key={col} sx={getColumnSx(col)}>
          {(() => {
            switch (col as Column) {
              case "publish":
                return <Switch defaultChecked={false} disabled={true} />;
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
                    options={
                      form.manufacturer
                        ? modelOptions.map((item) => item.Model)
                        : []
                    }
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
                      form.models.length > 0
                        ? modelOptions
                            .filter((option) =>
                              form?.models?.includes(option.Model),
                            )
                            .map((option) => option.Bodies)
                            .flat()
                        : []
                    }
                  />
                );
              case "name":
                return (
                  <Name
                    value={form.name as string}
                    onChange={handleChange}
                    options={[...helperData.name]}
                  />
                );
              case "description":
              case "english":
                return (
                  <Description
                    value={form[col] as string}
                    onChange={(val) => handleChange({ [col]: val })}
                  />
                );
              case "brand":
                return (
                  <Brand
                    value={form.brand as string}
                    onChange={handleChange}
                    options={[...helperData.brand]}
                  />
                );
              case "price":
                return (
                  <Price value={form.price as string} onChange={handleChange} />
                );
              case "origin":
                return (
                  <Origin value={String(form.origin)} onChange={handleChange} />
                );
              case "images":
                return (
                  <>
                    <Button onClick={toggle}>Select</Button>
                    {open && (
                      <Images
                        toggle={toggle}
                        onSelect={(url: string) => {
                          setForm({ ...form, [col]: url } as Row);
                        }}
                        defaultValue={`${form.manufacturer} ${form.models.toString()} ${form.english}`.trim()}
                      />
                    )}
                  </>
                );
              case "actions":
                return (
                  <>
                    <IconButton
                      aria-label="Save"
                      size="small"
                      onClick={() => handleSave(form)}
                    >
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="Cancel"
                      size="small"
                      onClick={onCancel}
                    >
                      <CloseIcon fontSize="small" />
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
