import { TableCell, TableHead, TableRow } from "@mui/material";

import Search from "@/components/Head/components/Search";
import { COLUMNS } from "@/constants";
import { getColumnSx, getIsColumnCopiable } from "@/helpers";
import { Column } from "@/types";

type Order = "asc" | "desc";

type Props = {
  onSearch: (column: Column, query: string) => void;
  onSort: (column: Column, order: Order) => void;
};

const Head = ({ onSearch, onSort }: Props) => {
  const handleSort = (sortBy: Column, orderBy: Order) => {
    onSort(sortBy, orderBy);
  };

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
            {getIsColumnCopiable(col) && (
              <Search
                column={col}
                onSearch={onSearch}
                onSortClick={(order: Order) => handleSort(col, order)}
              />
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default Head;
