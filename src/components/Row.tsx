import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Badge,
  Box,
  Chip,
  IconButton,
  Popover,
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
  highlightOEM: boolean;
  highlightAM: boolean;
};

const Row = ({
  row,
  idx,
  onEdit,
  onDelete,
  highlightOEM,
  highlightAM,
}: Props) => {
  const [hoveredColumn, setHoveredColumn] = useState<Column | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
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
            content = Array.isArray(row[col]) && (
              <>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  sx={{ pointerEvents: "none" }}
                >
                  <Stack>
                    {row[col].map((src) => (
                      <img src={src} key={src} width={100} alt="" />
                    ))}
                  </Stack>
                </Popover>
                <Badge badgeContent={row[col].length} color="primary">
                  <img
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                    src={row[col][0]}
                    alt="NMA"
                    style={{
                      height: "50px",
                      width: "50px",
                      objectFit: "cover",
                    }}
                  />
                </Badge>
              </>
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
          case "oemArticle":
            content = (
              <Stack alignItems="center" direction="row">
                {highlightOEM && (
                  <WarningIcon fontSize="small" color="warning" />
                )}
                <Typography noWrap fontSize={14}>
                  {row[col]}
                </Typography>
              </Stack>
            );
            break;
          case "amArticle":
            content = (
              <Stack alignItems="center" direction="row">
                {highlightAM && (
                  <WarningIcon fontSize="small" color="warning" />
                )}
                <Typography noWrap fontSize={14}>
                  {row[col]}
                </Typography>
              </Stack>
            );
            break;
          case "category":
            content = <Typography fontSize={14}>{row[col]}</Typography>;
            break;
          default:
            content = (
              <Typography noWrap fontSize={14}>
                {row[col]}
              </Typography>
            );
        }

        const isColumnCopiable = getIsColumnCopiable(col);

        return (
          <TableCell
            key={col}
            sx={{
              position: "relative",
              overflow: "hidden",
              padding: isColumnCopiable ? "6px" : "0px",
              fontSize: "14px",
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
