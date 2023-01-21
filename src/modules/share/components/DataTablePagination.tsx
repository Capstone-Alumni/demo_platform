import {
  Box,
  Button,
  TableCell,
  TableFooter,
  TableRow,
  Typography,
} from '@mui/material';

const DataTablePagination = ({
  colSpan = 1,
  currentPage = 1,
  totalPage = 1,
  onChangePage,
}: {
  colSpan?: number;
  currentPage?: number;
  totalPage?: number;
  onChangePage: (nextPage: number) => void;
}) => {
  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={colSpan}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              disabled={currentPage <= 1}
              onClick={() => onChangePage(currentPage - 1)}
            >
              Trang trước
            </Button>
            <Typography variant="button">{`Trang ${currentPage} trong số ${totalPage}`}</Typography>
            <Button
              variant="outlined"
              color="inherit"
              disabled={currentPage >= totalPage}
              onClick={() => onChangePage(currentPage + 1)}
            >
              Trang sau
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export default DataTablePagination;
