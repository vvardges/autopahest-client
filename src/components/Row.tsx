import {IconButton, Switch, TableCell, TableRow, Typography} from "@mui/material";
import {COLUMNS} from "@/constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {getColumnSx} from "@/helpers";
import type { ReactNode } from "react";
import type { Row as RowType } from "@/types";

const label = { inputProps: { "aria-label": "Actions" } };

type Props = {
  row: RowType;
  idx: number;
  onDoubleClick: (idx: number) => void;
};

const Row = ({ row, idx, onDoubleClick }: Props) => {
  return (
    <TableRow
      hover
      key={row.index}
      onDoubleClick={() => onDoubleClick(row.index)}
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
                  // onClick={() => setEditRowIdx(row.index)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="Delete"
                  size="small"
                  // onClick={() => handleDeleteRow(row.index)}
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
          >
            {content && (
              <Typography noWrap component="p" fontSize={14}>
                {content}
              </Typography>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default Row;