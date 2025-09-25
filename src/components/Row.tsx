import {IconButton, Switch, TableCell, TableRow, Typography} from "@mui/material";
import {COLUMNS} from "@/constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {getColumnSx} from "@/helpers";

const label = { inputProps: { "aria-label": "Actions" } }

const Row = ({ row, idx, onDoubleClick }) => {
    return (
        <TableRow
            hover
            key={row.index}
            onDoubleClick={() => onDoubleClick(row.index)}
            data-index={idx}
        >
            {COLUMNS.map(col => {
                let content: React.ReactNode;
                switch (col) {
                    case "models":
                        content = row[col].length ? row[col].map((item) => (item.Model)).join(", ") : "";
                        break;
                    case "bodies":
                        content = row[col].length ? row[col].map((item) => (item.label)).join(", ") : "";
                        break;
                    case "images":
                        content =
                            row[col] ? (
                                <img
                                    src={row[col]}
                                    alt="NMA"
                                    style={{ height: "50px", width: "50px", objectFit: "cover" }}
                                />
                            ) : (
                                row[col]
                            )
                        break
                    case "publish":
                        content = <Switch {...label} />
                        break
                    case "actions":
                        content = (
                            <>
                                <IconButton
                                    aria-label="Edit"
                                    size="small"
                                    //onClick={() => setEditRowIdx(row.index)}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    aria-label="Delete"
                                    size="small"
                                    //onClick={() => handleDeleteRow(row.index)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </>
                        )
                        break
                    default:
                        content = row[col]
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
                        {content &&
                            <Typography noWrap={true} component="p" fontSize={14}>
                                {content}
                            </Typography>
                        }
                    </TableCell>
                )
            })}
        </TableRow>
    )
}

export default Row;