import type { Theme } from "@mui/material";

import type { Column } from "@/types";

export const getColumnSx = (col: Column) => {
  const stickyBase = {
    position: "sticky",
    zIndex: 2,
    backgroundColor: (theme: Theme) => theme.palette.background.default,
  } as const;

  switch (col) {
    case "publish":
      return {
        ...stickyBase,
        left: 0,
        width: 60,
      };
    case "index":
      return {
        ...stickyBase,
        left: 60, // width of the "Actions" colum
        width: 30,
      };
    case "manufacturer":
      return {
        width: 120,
      };
    case "models":
      return {
        width: 150,
      };
    case "bodies":
      return {
        width: 200,
      };
    case "name":
      return {
        width: 160,
      };
    case "description":
      return {
        width: 160,
      };
    case "brand":
      return {
        width: 100,
      };
    case "origin":
      return {
        width: 65,
      };
    case "price":
      return {
        width: 95,
      };
    case "actions":
      return {
        ...stickyBase,
        right: 0,
        width: 70,
      };
    default:
      return {
        width: 80,
      };
  }
};

export const getIsColumnCopiable = (col: Column) =>
  col !== "actions" && col !== "index" && col !== "publish";
