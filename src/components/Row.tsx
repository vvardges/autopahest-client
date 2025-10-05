import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Switch,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";

import { COLUMNS } from "@/constants";
import { getColumnSx, getIsColumnCopiable } from "@/helpers";
import type { Column, Row as RowType } from "@/types";

const label = { inputProps: { "aria-label": "Actions" } };

type Props = {
  row: RowType;
  idx: number;
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
};

const Row = ({ row, idx, onEdit, onDelete }: Props) => {
  const [hoveredColumn, setHoveredColumn] = useState<Column | null>(null);
  return (
    <TableRow
      hover
      key={row.index}
      onDoubleClick={() => onEdit(row.index)}
      data-index={idx}
    >
      {COLUMNS.map((col) => {
        let content: ReactNode;

        switch (col) {
          case "index":
            content = idx + 1;
            break;
          case "models":
          case "bodies":
            content = (
              <Stack gap="4px">
                {row[col].map((label, index) => (
                  <Chip key={index} label={label} size="small" />
                ))}
              </Stack>
            );
            break;
          case "images":
            content = row[col] ? (
              <img
                src={row[col]}
                alt="NMA"
                style={{ height: "50px", width: "50px", objectFit: "cover" }}
              />
            ) : (
              row[col]
            );
            break;
          case "publish":
            content = <Switch {...label} />;
            break;
          case "actions":
            content = (
              <>
                <IconButton
                  aria-label="Edit"
                  size="small"
                  onClick={() => onEdit(row.index)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="Delete"
                  size="small"
                  onClick={() => onDelete(row.index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            );
            break;
          case "english":
          case "name":
          case "description":
            content = row[col];
            break;
          default:
            content = <Typography noWrap>{row[col]}</Typography>;
        }

        const isColumnCopiable = getIsColumnCopiable(col);

        return (
          <TableCell
            key={col}
            sx={{
              position: "relative",
              overflow: "hidden",
              padding: isColumnCopiable ? "16px" : "0px",
              ...getColumnSx(col),
            }}
            onMouseEnter={() => setHoveredColumn(col)}
            onMouseLeave={() => setHoveredColumn(null)}
          >
            {content && (
              <>
                {content}
                {isColumnCopiable && hoveredColumn === col && (
                  <Box
                    position="absolute"
                    right={0}
                    top="50%"
                    sx={{ transform: "translateY(-50%)" }}
                  >
                    <IconButton size="small" data-index={idx} data-column={col}>
                      <UnfoldMoreIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default Row;
