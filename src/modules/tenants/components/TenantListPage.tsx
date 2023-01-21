'use client';

import { useRecoilState } from 'recoil';

import { Box, Button, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import LoadingIndicator from '@share/components/LoadingIndicator';

import useGetTenantList from '../hooks/useGetTenantList';
import useDeleteTenantById from '../hooks/useDeleteTenantById';
import { getTenantListParamsAtom } from '../state';

import TenantListTable from './TenantListTable';
import Link from 'next/link';

const TenantListPage = () => {
  const theme = useTheme();

  const [params, setParams] = useRecoilState(getTenantListParamsAtom);

  const { deleteTenantById } = useDeleteTenantById();
  const {
    reload,
    data: tenantListData,
    isLoading: isGettingTenant,
  } = useGetTenantList();

  const onDelete = async (id: string) => {
    await deleteTenantById({ id });
    reload();
  };

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
        <Typography variant="h3">Tenants</Typography>

        <Link href="/tenants/create">
          <Button variant="contained" startIcon={<AddIcon />}>
            Add tenant
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          width: '100%',
        }}
      >
        {isGettingTenant ? <LoadingIndicator /> : null}

        {tenantListData?.data ? (
          <TenantListTable
            data={tenantListData?.data}
            onDelete={onDelete}
            page={params.page || 1}
            onChangePage={nextPage => {
              setParams(prevParams => ({ ...prevParams, page: nextPage }));
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default TenantListPage;
