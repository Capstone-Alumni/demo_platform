'use client';

import {
  Box,
  Button,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { getTransactionListParamsAtom } from '../state';
import SearchInput from '@share/components/SearchInput';
import useGetTransactionList from '../hooks/useGetTransactionList';
import { Paper } from '@mui/material';
import { Table } from '@mui/material';
import { TableCell } from '@mui/material';
import DataTablePagination from '@share/components/DataTablePagination';
import { formatDate } from '@share/utils/formatDate';
import Link from 'next/link';
import getSubscriptionDisplay from '@share/utils/getSubscriptionDisplay';
import LoadingIndicator from '@share/components/LoadingIndicator';

const renderTransactionStatus = (status: number) => {
  if (status === 0) {
    return (
      <Button variant="outlined" color="warning">
        Đang chờ thanh toán
      </Button>
    );
  }

  if (status === 1) {
    return (
      <Button variant="outlined" color="success">
        Thanh toán thành công
      </Button>
    );
  }

  if (status === 2) {
    return (
      <Button variant="outlined" color="error">
        Thanh toán thất bại
      </Button>
    );
  }

  return null;
};

const TransactionListPage = () => {
  const theme = useTheme();

  const [params, setParams] = useRecoilState(getTransactionListParamsAtom);

  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetTransactionList();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: theme.spacing(4),
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3">Giao dịch</Typography>
      </Box>

      <form
        onSubmit={e => {
          e.preventDefault();
          setParams(prevParams => ({ ...prevParams, tenantName: search }));
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing(1),
          width: '100%',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <SearchInput
            placeholder="Tìm kiếm theo tên trường"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Box>

        <Button type="submit" variant="contained">
          Tìm
        </Button>
      </form>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Box
          sx={{
            width: '100%',
          }}
        >
          <TableContainer component={Paper}>
            <Table aria-label="Tenant table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Tên trường</TableCell>
                  <TableCell align="left">Gói đăng ký</TableCell>
                  <TableCell align="left">Ngày tạo</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.items.map(row => (
                  <TableRow key={row.id}>
                    <TableCell align="left">
                      <Link href={`/dashboard/tenants/${row.tenantId}`}>
                        <Typography>{row.tenant.name}</Typography>
                      </Link>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>
                        {getSubscriptionDisplay(row.plan.name)}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>
                        {formatDate(new Date(row.createdAt))}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {renderTransactionStatus(row.paymentStatus)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <DataTablePagination
                colSpan={4}
                currentPage={params.page}
                totalPage={Math.ceil(
                  (data?.data.totalItems || 0) / (data?.data.itemPerPage || 1),
                )}
                onChangePage={nextPage => {
                  setParams(prevParams => ({ ...prevParams, page: nextPage }));
                }}
              />
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default TransactionListPage;
