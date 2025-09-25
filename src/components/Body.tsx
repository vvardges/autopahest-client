import { TableBody } from "@mui/material";
import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";

let index: number;

type Props = {
    children: ReactNode;
    onDragEnd: (start: number, end: number, index: number) => void;
}

const Body = ({ children, onDragEnd }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);

  const handleStart = (e: MouseEvent) => {
    const cell = (e.target as HTMLElement).closest("td");
    const row = cell?.closest("tr");
    if(!row || !cell) return;
    index = Array.from(row.children).indexOf(cell);

    setIsDragging(true);
    setStart(Number(row?.dataset.index));
  }

  const handleMove = (e: MouseEvent) => {
    const row = (e.target as HTMLElement).closest("tr");
    setEnd(Number(row?.dataset.index));
  }

  const handleEnd = () => {
    setIsDragging(false);
    setStart(null);
    setEnd(null);

    if(start && end && end > start && index) {
      onDragEnd(start, end, index);
    }
  }

  return (
    <TableBody
      onMouseDown={handleStart}
      onMouseMove={isDragging ? handleMove : undefined}
      onMouseUp={isDragging ? handleEnd : undefined}
      sx={(start && end) ? {
        [`& tr:nth-of-type(n+${start + 1}):nth-of-type(-n+${end + 1})`]: {
          backgroundColor: "rgba(55, 111, 208, 0.1)", // light blue
        },
      } : undefined}
    >
      {children}
    </TableBody>
  )
}

export default Body;