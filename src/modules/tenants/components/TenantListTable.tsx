import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { GetTenantListData } from '../types';
import TenantListItem from './TenantListItem';
import DataTablePagination from '@share/components/DataTablePagination';

const AdminTenantListTable = ({
  data,
  onDelete,
  onActivate,
  onDeactivate,
  page,
  onChangePage,
}: {
  data: GetTenantListData;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  page: number;
  onChangePage: (nextPage: number) => void;
}) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="Tenant table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Id khách hàng</TableCell>
              <TableCell align="left">Tên</TableCell>
              <TableCell align="left">Subdomain</TableCell>
              <TableCell align="left">Người quản lý</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map(row => (
              <TenantListItem
                key={row.tenantId}
                data={row}
                onDelete={onDelete}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
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

export default AdminTenantListTable;
