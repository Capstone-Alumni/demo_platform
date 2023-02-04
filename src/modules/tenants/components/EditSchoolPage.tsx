'use client';

import { Box, Typography, useTheme } from '@mui/material';

import useUpdateTenantById from '../hooks/useUpdateTenantById';
import { Tenant } from '../types';
import EditSChoolForm, { EditSChoolFormValues } from './EditSchoolForm';

const EditSchoolPage = ({ initialData }: { initialData: Tenant }) => {
  const theme = useTheme();

  const { updateTenantById } = useUpdateTenantById();

  const onUpdate = async (values: EditSChoolFormValues) => {
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
          Thông tin của trường
        </Typography>
      </Box>

      <EditSChoolForm initialData={initialData} onSubmit={onUpdate} />
    </Box>
  );
};

export default EditSchoolPage;
