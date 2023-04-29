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
      }}
    >
      <Container
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'row',
          paddingTop: theme.spacing(18),
        }}
      >
        <Box
          sx={{
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
              Nền tảng kết nối cựu học sinh THPT
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 4,
              color: 'GrayText',
            }}
            fontSize={20}
            variant="body2"
          >
            Nền tảng kết nối cựu học sinh là ứng dụng cung cấp cho nhà trường và
            các cựu học sinh kết nối, tương tác với nhau và tạo ra một cộng đồng
            mạnh mẽ và đoàn kết.
          </Typography>

          <Box
            sx={{
              mt: 5,
            }}
          >
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
        <Box
          sx={{
            width: '100%',
            backgroundImage: 'url("/landing-page-intro-background.png")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      </Container>
    </Box>
  );
};

export default IntroductionSection;
