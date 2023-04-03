'use client';

import { Box, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Done from 'public/thankyou.svg';

const RegisterSuccess = () => {
  const theme = useTheme();

  return (
    <Stack direction={{ md: 'row', sm: 'column-reverse' }} alignItems="center">
      <Box sx={{ minWidth: '30rem' }}>
        <Typography variant="h2">Đăng ký thành công</Typography>
        <Typography sx={{ mb: 2 }}>
          Cảm ơn bạn đã chọn chúng tôi. Tuy nhiên để đảm bảo thông tin của bạn
          chính xác, chúng tôi sẽ liên hệ lại với nhà trường và gửi bạn thông
          tin thanh toán qua email.
        </Typography>
      </Box>
      <Image src="/done.svg" alt="error" width={500} height={500} />
      {/* <Done style={{ fill: theme.palette.success.main }} /> */}
    </Stack>
  );
};

export default RegisterSuccess;
