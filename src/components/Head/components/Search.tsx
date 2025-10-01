import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { Column } from "@/types";

type Props = {
  onSearch: (column: Column, query: string) => void;
  column: Column;
};

function Search({ column, onSearch }: Props) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(column, debouncedQuery);
  }, [debouncedQuery, onSearch, column]);

  return (
    <TextField
      placeholder={column}
      size="small"
      fullWidth
      onChange={(e) => setQuery(e.target.value)}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => console.log("Search clicked")} size="small">
                <ArrowDropUpIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default Search;
