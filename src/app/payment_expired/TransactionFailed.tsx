'use client';

import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';

const TransactionFailed = () => {
  return (
    <Stack direction={{ md: 'row', sm: 'column-reverse' }} alignItems="center">
      <Box sx={{ minWidth: '30rem' }}>
        <Typography variant="h1">Quá hạn thanh toán</Typography>
        <Typography sx={{ mb: 2 }}>
          Rất tiếc, đã quá hạn thanh toán. Hay liên hệ support-alumni@gmail.com
          để được hỗ trợ
        </Typography>
      </Box>
      <Image src="/error.svg" alt="error" width={500} height={500} />
      {/* <ErrorSVG /> */}
    </Stack>
  );
};

export default TransactionFailed;
