'use client';

import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';

const TransactionFailed = () => {
  return (
    <Stack direction={{ md: 'row', sm: 'column-reverse' }} alignItems="center">
      <Box sx={{ minWidth: '30rem' }}>
        <Typography variant="h1">Bạn đã thanh toán thành công</Typography>
      </Box>
      <Image src="/done.svg" alt="error" width={500} height={500} />
      {/* <ErrorSVG /> */}
    </Stack>
  );
};

export default TransactionFailed;
