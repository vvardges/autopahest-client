import { TableCell, TableHead, TableRow } from "@mui/material";

import Search from "@/components/Head/components/Search";
import { COLUMNS } from "@/constants";
import { getColumnSx, getIsColumnCopiable } from "@/helpers";
import { Column } from "@/types";

type Props = {
  onSearch: (column: Column, query: string) => void;
};

const Head = ({ onSearch }: Props) => {
  return (
    <TableHead>
      <TableRow>
        {COLUMNS.map((col) => (
          <TableCell
            padding="none"
            key={col}
            sx={{
              ...getColumnSx(col),
              zIndex: 3,
              textTransform: "uppercase",
            }}
          >
            {getIsColumnCopiable(col) && <Search column={col} onSearch={onSearch} />}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default Head;
