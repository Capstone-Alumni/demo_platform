import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Member } from '../types';
import { MemberFormValues } from './MemberForm';
import AdminMemberListItem from './MemberListItem';
import { Typography } from '@mui/material';
import DataTablePagination from '@share/components/DataTablePagination';

const AdminMemberListTable = ({
  data,
  onEdit,
  onDelete,
  page,
  onChangePage,
}: {
  data: {
    items: Member[];
    totalItems: number;
    itemPerPage: number;
  };
  onEdit: (id: string, data: MemberFormValues) => void;
  onDelete: (id: string) => void;
  page: number;
  onChangePage: (page: number) => void;
}) => {
  if (data.totalItems === 0) {
    return (
      <Typography textAlign="center" variant="h6">
        Chưa tạo lớp
      </Typography>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="Member table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Email</TableCell>
              <TableCell align="center">Mat khau</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map(row => (
              <AdminMemberListItem
                key={row.id}
                data={row}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </TableBody>
          <DataTablePagination
            colSpan={6}
            currentPage={page}
            totalPage={Math.ceil(data.totalItems / data.itemPerPage)}
            onChangePage={onChangePage}
          />
        </Table>
      </TableContainer>
    </>
  );
};

export default AdminMemberListTable;
