'use client';

import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ThankYou from 'public/thankyou.svg';

const TransactionSuccess = () => {
  const theme = useTheme();

  return (
    <Stack direction={{ md: 'row', sm: 'column-reverse' }} alignItems="center">
      <Box sx={{ minWidth: '30rem' }}>
        <Typography variant="h2">Thanh toán thành công</Typography>
        <Typography sx={{ mb: 2 }}>Mời bạn kiểm tra email</Typography>
      </Box>
      <Image src="/thankyou.svg" alt="thankyou" width={500} height={500} />
      {/* <ThankYou style={{ fill: theme.palette.success.main }} /> */}
    </Stack>
  );
};

export default TransactionSuccess;
