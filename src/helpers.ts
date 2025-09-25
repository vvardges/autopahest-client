import type { Column } from "@/types";

export const getColumnSx = (col: Column) => {
  const stickyBase = {
    position: "sticky",
    zIndex: 2,
    backgroundColor: (theme: any) => theme.palette.background.default,
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
    case "name":
      return {
        width: 160,
      }
    case "description":
      return {
        width: 160,
      }
    case "manufacturer":
      return {
        width: 120,
      }
    case "models":
      return {
        width: 150,
      }
    case "bodies":
      return {
        width: 200,
      }
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