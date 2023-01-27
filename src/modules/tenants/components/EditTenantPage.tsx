'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import useUpdateTenantById from '../hooks/useUpdateTenantById';
import { Tenant } from '../types';
import EditTenantForm, { EditTenantFormValues } from './EditTenantForm';

const EditTenantPage = ({ initialData }: { initialData: Tenant }) => {
  const theme = useTheme();
  const router = useRouter();

  const { updateTenantById } = useUpdateTenantById();

  const onUpdate = async (values: EditTenantFormValues) => {
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
          {initialData.name}
        </Typography>
      </Box>

      <EditTenantForm
        initialData={initialData}
        onSubmit={onUpdate}
        onClose={() => router.push('/dashboard/tenants')}
      />
    </Box>
  );
};

export default EditTenantPage;
