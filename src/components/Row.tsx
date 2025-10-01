import {Box, IconButton, Switch, TableCell, TableRow, Typography} from "@mui/material";
import {COLUMNS} from "@/constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import {getColumnSx, getIsColumnCopiable} from "@/helpers";
import {ReactNode, useState} from "react";
import type {Column, Row as RowType} from "@/types";

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
          case "models":
          case "bodies":
            content = row[col].join(", ");
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
          default:
            content = row[col];
        }

        return (
          <TableCell
            key={col}
            padding="none"
            sx={{
              position: "relative",
              paddingLeft: "5px",
              ...getColumnSx(col),
            }}
            onMouseEnter={() => setHoveredColumn(col)}
            onMouseLeave={() => setHoveredColumn(null)}
          >
            {content && (
                <>
                  <Typography component="p" fontSize={14}>
                    {content}
                  </Typography>
                  {getIsColumnCopiable(col) && hoveredColumn === col &&
                      <Box position="absolute" right={0} top="50%" sx={{transform: "translateY(-50%)"}}>
                        <IconButton size="small" data-index={idx} data-column={col}>
                            <UnfoldMoreIcon fontSize="small" />
                        </IconButton>
                      </Box>
                  }
                </>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default Row;