import { Skeleton, TableBody, TableCell, TableRow } from "@mui/material";
import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";

import { COLUMNS } from "@/constants";
import { Column } from "@/types";

type Props = {
  children: ReactNode;
  onDragEnd: (start: number, end: number, column: Column[]) => void;
  isLoading?: boolean;
};

const LoadingSkeleton = ({ rows = 20, cols = COLUMNS.length }) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, r) => (
      <TableRow key={r}>
        {Array.from({ length: cols }).map((_, c) => (
          <TableCell key={c}>
            <Skeleton variant="text" width="80%" height={60} />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

const Body = ({ children, onDragEnd, isLoading }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);

  if (isLoading) return <LoadingSkeleton />;

  const handleStart = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest("button");
    if (!target || target.dataset.index === undefined) return;

    const index = +target.dataset.index;
    const col = target.dataset.column as Column;

    let columns;
    if (col === "bodies") columns = ["bodies", "models", "manufacturers"];
    else if (col === "models") columns = ["models", "manufacturers"];
    else columns = [col];

    setIsDragging(true);
    setColumns(columns as Column[]);
    setStart(index);
    setEnd(index);
  };

  const handleMove = (e: MouseEvent) => {
    const row = (e.target as HTMLElement).closest("tr");
    setEnd(Number(row?.dataset.index));
  };

  const handleEnd = () => {
    setIsDragging(false);

    if (start !== null && end !== null && end > start && columns.length > 0) {
      onDragEnd(start, end, columns);
    }

    setStart(null);
    setEnd(null);
  };

  return (
    <TableBody
      onMouseDown={handleStart}
      onMouseMove={isDragging ? handleMove : undefined}
      onMouseUp={isDragging ? handleEnd : undefined}
      sx={
        start && end && columns.length > 0
          ? {
              [`& tr:nth-of-type(n+${start + 1}):nth-of-type(-n+${end + 1}) td:is(${columns.map((column) => `:nth-child(${COLUMNS.indexOf(column) + 1})`).join(", ")})`]:
                {
                  backgroundColor: "rgba(55, 111, 208, 0.1)", // light blue
                },
            }
          : undefined
      }
    >
      {children}
    </TableBody>
  );
};

export default Body;
