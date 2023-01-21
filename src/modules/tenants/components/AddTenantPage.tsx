'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import useCreateTenant from '../hooks/useCreateTenant';

import TenantForm, { TenantFormValues } from './TenantForm';

const AddTenantPage = () => {
  const theme = useTheme();
  const router = useRouter();

  const { createTenant } = useCreateTenant();

  const onAddTenant = async (values: TenantFormValues) => {
    await createTenant(values);
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
        onSubmit={onAddTenant}
        onClose={() => router.push('/tenants')}
      />
    </Box>
  );
};

export default AddTenantPage;
