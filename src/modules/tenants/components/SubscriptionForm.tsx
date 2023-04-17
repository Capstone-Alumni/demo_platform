'use client';

import { Box, Paper, Typography, useTheme } from '@mui/material';

import { Tenant } from '../types';
import { formatDate } from '@share/utils/formatDate';
import getSubscriptionDisplay from '@share/utils/getSubscriptionDisplay';

const SubscriptionForm = ({ initialData: data }: { initialData: Tenant }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        padding: theme.spacing(2),
        border: 1,
        borderColor: theme.palette.divider,
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">Gói đăng ký</Typography>
        <Typography>{getSubscriptionDisplay(data.plan?.name)}</Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Typography variant="h6">Ngày hết hạn</Typography>
        <Typography>
          {data.subscriptionEndTime
            ? formatDate(new Date(data.subscriptionEndTime))
            : 'Chưa thanh toán'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SubscriptionForm;
