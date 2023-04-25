'use client';

import { useRecoilState } from 'recoil';

import {
  Box,
  Button,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import LoadingIndicator from '@share/components/LoadingIndicator';

import useGetTenantList from '../hooks/useGetTenantList';
import useDeleteTenantById from '../hooks/useDeleteTenantById';
import { getTenantListParamsAtom } from '../state';

import TenantListTable from './TenantListTable';
import useActivateTenantById from '../hooks/useActivateTenant';
import useDeactivateTenantById from '../hooks/useDeactivateTenant';
import { useEffect, useState } from 'react';

import PlanData from 'src/data.json';
import SearchInput from '@share/components/SearchInput';

const TenantListPage = () => {
  const theme = useTheme();

  const [params, setParams] = useRecoilState(getTenantListParamsAtom);

  const [planSearchParams, setPlanSearhParams] = useState('all');
  const [search, setSearch] = useState('');

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

      <form
        onSubmit={e => {
          e.preventDefault();
          setParams(prevParams => ({ ...prevParams, name: search }));
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing(1),
          width: '100%',
        }}
      >
        <TextField
          value={planSearchParams}
          onChange={e => setPlanSearhParams(e.target.value)}
          select
          type="select"
          label="Gói đăng ký"
          size="small"
          sx={{ minWidth: '120px' }}
        >
          <MenuItem key="all" value="all">
            Tất cả
          </MenuItem>
          {PlanData?.map(op => (
            <MenuItem key={op.name} value={op.name}>
              {op.display}
            </MenuItem>
          ))}
        </TextField>

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
