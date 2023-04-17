'use client';

import { useRecoilState } from 'recoil';

import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material';

import LoadingIndicator from '@share/components/LoadingIndicator';

import useGetTenantList from '../hooks/useGetTenantList';
import useDeleteTenantById from '../hooks/useDeleteTenantById';
import { getTenantListParamsAtom } from '../state';

import TenantListTable from './TenantListTable';
import useActivateTenantById from '../hooks/useActivateTenant';
import useDeactivateTenantById from '../hooks/useDeactivateTenant';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const TenantListPage = () => {
  const theme = useTheme();

  const [params, setParams] = useRecoilState(getTenantListParamsAtom);
  const searchParam = useSearchParams();
  const planSearchParams = searchParam.get('plan') || '3-month';

  const { deleteTenantById } = useDeleteTenantById();
  const { activateTenantById } = useActivateTenantById();
  const { deactivateTenantById } = useDeactivateTenantById();

  const {
    reload,
    data: tenantListData,
    isLoading: isGettingTenant,
  } = useGetTenantList();

  const onDelete = async (id: string) => {
    await deleteTenantById({ id });
    reload();
  };

  const onActivate = async (id: string) => {
    await activateTenantById({ id });
    reload();
  };

  const onDeactivate = async (id: string) => {
    await deactivateTenantById({ id });
    reload();
  };

  useEffect(() => {
    setParams(prevParams => ({
      ...prevParams,
      planName: planSearchParams,
    }));
  }, [planSearchParams]);

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
        <Typography variant="h3">Khách hàng</Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
        }}
      >
        {isGettingTenant ? <LoadingIndicator /> : null}
        {tenantListData?.data ? (
          <>
            <TenantListTable
              data={tenantListData?.data}
              onDelete={onDelete}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
              page={params.page || 1}
              onChangePage={nextPage => {
                setParams(prevParams => ({ ...prevParams, page: nextPage }));
              }}
            />
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default TenantListPage;
