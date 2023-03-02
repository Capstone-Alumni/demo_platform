'use client';

import { Button } from '@mui/material';
import { Box, Link, Typography, useTheme } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LoadingIndicator from '@share/components/LoadingIndicator';
import getTenantHost from 'src/modules/tenants/utils/getTenantHost';
import useGetMySchool from '../hooks/useGetMySchool';

import useUpdateTenantById from '../hooks/useUpdateTenantById';
import EditSChoolForm, { EditSChoolFormValues } from './EditSchoolForm';

const EditSchoolPage = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetMySchool();
  const initialData = data?.data;

  const { updateTenantById } = useUpdateTenantById();

  const onUpdate = async (values: EditSChoolFormValues) => {
    if (initialData?.id) {
      await updateTenantById({ id: initialData.id, ...values });
    }
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
          <br />
          {initialData?.subdomain && initialData?.activated ? (
            <Link
              href={getTenantHost(initialData.subdomain)}
              target="_blank"
              rel="noreferrer"
            >
              <Button startIcon={<OpenInNewIcon />}>Mở trang web</Button>
            </Link>
          ) : (
            <Typography>Chưa được kích hoạt</Typography>
          )}
        </Typography>
      </Box>

      {isLoading || !initialData ? (
        <LoadingIndicator />
      ) : (
        <EditSChoolForm initialData={initialData} onSubmit={onUpdate} />
      )}
    </Box>
  );
};

export default EditSchoolPage;
