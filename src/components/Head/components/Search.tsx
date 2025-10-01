import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { Column } from "@/types";

type Order = "asc" | "desc";

type Props = {
  onSearch: (column: Column, query: string) => void;
  onSortClick: (order: Order) => void;
  column: Column;
};

function Search({ column, onSearch, onSortClick }: Props) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [order, setOrder] = useState<Order>("asc");

  const handleSort = () => {
      const newOrder = order === "asc" ? "desc" : "asc";
      setOrder(newOrder);
      onSortClick(newOrder);
  }

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
              <IconButton onClick={handleSort} size="small">
                {order === "asc" ? (
                  <ArrowDropUpIcon fontSize="small" />
                ) : (
                  <ArrowDropDownIcon fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default Search;
