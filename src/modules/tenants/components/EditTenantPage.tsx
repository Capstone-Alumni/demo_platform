'use client';

import { Box, Button, Link, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import useUpdateTenantById from '../hooks/useUpdateTenantById';
import { Tenant } from '../types';
import getTenantHost from '../utils/getTenantHost';
import EditTenantForm, { EditTenantFormValues } from './EditTenantForm';
import SubscriptionForm from './SubscriptionForm';

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
          <br />
          {initialData.subdomain && initialData.approved ? (
            <Link
              href={getTenantHost(initialData.subdomain)}
              target="_blank"
              rel="noreferrer"
            >
              <Button startIcon={<OpenInNewIcon />}>Mở trang web</Button>
            </Link>
          ) : null}
        </Typography>
      </Box>

      <SubscriptionForm initialData={initialData} />

      <EditTenantForm
        initialData={initialData}
        onSubmit={onUpdate}
        onClose={() => router.push('/dashboard/tenants')}
      />
    </Box>
  );
};

export default EditTenantPage;
