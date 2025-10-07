import {
  Close as CloseIcon,
  ImageRounded as ImageIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  Badge,
  Button,
  IconButton,
  Switch,
  TableCell,
  TableRow,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

import {
  Body,
  Brand,
  Category,
  Default,
  Description,
  Images,
  Manufacturer,
  Model,
  Name,
  Origin,
  Price,
  Tags,
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
    tags: Set<string>;
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

  const manufacturers = form.manufacturers;
  useEffect(() => {
    const loadModels = async() => {
      try {
        const results = await Promise.all(
          manufacturers.map(
            (manufacturer) => import(`../../data/${manufacturer}.json`),
          ),
        );

        // Merge all arrays into one (if each JSON exports an array)
        const allOptions: ModelOptions[] = results.flatMap(
          (res) => res.default,
        );
        setModelOptions(allOptions);
      } catch (error) {
        console.error("Failed to load model data:", error);
      }
    };

    loadModels();
  }, [manufacturers]);

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
              case "manufacturers":
                return (
                  <Manufacturer
                    value={form.manufacturers as string[]}
                    onChange={handleChange}
                  />
                );
              case "models":
                return (
                  <Model
                    options={
                      form.manufacturers?.length > 0
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
                    <Button onClick={toggle}>
                      {form.images.length > 0 ? (
                        <Badge
                          badgeContent={form.images.length}
                          color="primary"
                        >
                          <img
                            src={form.images[0]}
                            alt="NMA"
                            style={{
                              height: "50px",
                              width: "50px",
                              objectFit: "cover",
                            }}
                          />
                        </Badge>
                      ) : (
                        <ImageIcon />
                      )}
                    </Button>
                    {open && (
                      <Images
                        toggle={toggle}
                        onSelect={(urls: string[]) => {
                          setForm({ ...form, [col]: urls } as Row);
                        }}
                        defaultValue={
                          form.oemArticle
                            ? `${form.manufacturers[0]} ${form.models[0].split("/")[0].trim()} ${form.oemArticle}`
                            : `${form.english}`
                        }
                        defaultSelected={form.images}
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
              case "category":
                return (
                  <Category
                    value={String(form.category)}
                    onChange={handleChange}
                  />
                );
              case "tags":
                return (
                  <Tags
                    value={form.tags}
                    onChange={handleChange}
                    options={[...helperData.tags]}
                  />
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
