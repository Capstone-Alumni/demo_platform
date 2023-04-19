'use client';

import { Box, Button, Paper, Stack, Typography, useTheme } from '@mui/material';

import { Tenant } from '../types';
import { formatDate } from '@share/utils/formatDate';
import getSubscriptionDisplay from '@share/utils/getSubscriptionDisplay';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { differenceInDays } from 'date-fns';

const SubscriptionForm = ({ initialData: data }: { initialData: Tenant }) => {
  const theme = useTheme();

  const isNearEndTime =
    data.requestStatus === 1 &&
    data._count?.transactions &&
    differenceInDays(new Date(data.subscriptionEndTime ?? ''), new Date()) <=
      10;

  const hasTransaction = data.requestStatus && data._count?.transactions;

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
        <Stack direction="row" gap={2}>
          <Typography variant="h6">Ngày hết hạn</Typography>

          {data.paymentToken ? (
            <Stack direction="row" gap={0.5}>
              <WarningAmberIcon color="warning" />
              <Typography>Đã gửi yêu cầu thanh toán</Typography>
            </Stack>
          ) : null}
        </Stack>
        <Typography
          color={isNearEndTime ? 'error' : ''}
          fontWeight={isNearEndTime ? 600 : undefined}
        >
          {hasTransaction
            ? formatDate(new Date(data?.subscriptionEndTime || ''))
            : data?.requestStatus === 1
            ? 'Chưa thanh toán'
            : ''}
        </Typography>
        {data.requestStatus === 2 ? (
          <Button variant="outlined" color="error">
            Đã bị từ chối
          </Button>
        ) : null}
      </Box>
    </Paper>
  );
};

export default SubscriptionForm;
