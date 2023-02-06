'use client';

import { Container, useTheme } from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const IntroductionSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        paddingX: theme.spacing(2),
        backgroundImage: 'url("/landing-page-intro-background.png")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <Container
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'row',
          paddingTop: theme.spacing(18),
        }}
      >
        <Box
          sx={{
            width: '40vw',
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: theme.spacing(2),
            }}
          >
            <Image
              height={120}
              width={120}
              alt="platform-logo"
              src="/connect-alumni.jpg"
            />
            <Typography variant="h2" color="primary">
              Alumni Connector Platform
            </Typography>
          </Box>

          <Typography fontSize={22}>
            Nền tảng kết nối cựu học sinh là dịch vụ cung cấp nơi cho nhà trường
            và các cựu học sinh kết nối lại với nhau.
          </Typography>

          <Typography fontSize={18}>
            Ở đây cựu học sinh có thể tìm lại những người bạn học cũ của mình,
            nắm được những tin tức của trường, tạo ra các hoạt động liên quan
            đến cựu học sinh, gây quỹ ủng hộ hay tạo ra các hoạt động định hướng
            nghề nghiệp cho các học sinh hiện tại.
          </Typography>

          <Box>
            <Link
              href="/register_tenant"
              style={{ textDecoration: 'none', textUnderlineOffset: 0 }}
            >
              <Button variant="contained" size="large">
                Gia nhập ngay
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default IntroductionSection;
