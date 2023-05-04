'use client';

import { Box, Button, Link, Typography, useTheme } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { Tenant } from '../types';
import getTenantHost from '../utils/getTenantHost';
import SubscriptionForm from './SubscriptionForm';
import TenantDetail from './TenantDetail';
import ActionBoard from './ActionBoard';
import { isEmpty } from 'lodash';
import { differenceInDays } from 'date-fns';

const TenantDetailPage = ({ initialData }: { initialData: Tenant }) => {
  const theme = useTheme();

  const isNearEndTime =
    initialData.requestStatus === 1 &&
    initialData._count?.transactions &&
    differenceInDays(
      new Date(initialData.subscriptionEndTime ?? ''),
      new Date(),
    ) <= 10;

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
          {initialData.subdomain && !isEmpty(initialData.transactions) ? (
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

      {initialData.requestStatus === 0 ||
      (initialData.requestStatus === 1 && isNearEndTime) ? (
        <ActionBoard tenantData={initialData} />
      ) : null}

      <SubscriptionForm initialData={initialData} />

      <TenantDetail initialData={initialData} />
    </Box>
  );
};

export default TenantDetailPage;
