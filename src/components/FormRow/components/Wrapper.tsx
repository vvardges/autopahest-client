import { TableCell } from "@mui/material";

function Wrapper({ children }) {
  return (
    <TableCell
      padding="none"
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        zIndex: 2,
        position: "sticky",
        left: 60, // width of the "Actions" colum
        width: 30,
      }}
    >
      {children}
    </TableCell>
  );
}

export default Wrapper;
