'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import useUpdateTenantById from '../hooks/useUpdateTenantById';
import { Tenant } from '../types';

import TenantForm, { TenantFormValues } from './TenantForm';

const EditTenantPage = ({ initialData }: { initialData: Tenant }) => {
  const theme = useTheme();
  const router = useRouter();

  const { updateTenantById } = useUpdateTenantById();

  const onUpdate = async (values: TenantFormValues) => {
    await updateTenantById({ id: initialData.id, ...values });
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
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" sx={{ flex: 1 }}>
          Tenants
        </Typography>
      </Box>

      <TenantForm
        initialData={initialData}
        onSubmit={onUpdate}
        onClose={() => router.push('/tenants')}
      />
    </Box>
  );
};

export default EditTenantPage;
