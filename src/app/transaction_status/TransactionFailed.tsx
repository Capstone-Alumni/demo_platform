'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ErrorSVG from 'public/error.svg';

const TransactionFailed = () => {
  const router = useRouter();

  return (
    <Stack direction={{ md: 'row', sm: 'column-reverse' }} alignItems="center">
      <Box sx={{ minWidth: '30rem' }}>
        <Typography variant="h1">Thanh toán thất bại</Typography>
        <Typography sx={{ mb: 2 }}>
          Rất tiếc, thanh toán không thành công.
        </Typography>
      </Box>
      <Image src="/error.svg" alt="error" width={500} height={500} />
      {/* <ErrorSVG /> */}
    </Stack>
  );
};

export default TransactionFailed;
