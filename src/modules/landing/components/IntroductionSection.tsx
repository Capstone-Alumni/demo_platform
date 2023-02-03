'use client';

import { Container, useTheme } from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';

const IntroductionSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        paddingX: theme.spacing(2),
        // backgroundColor: 'yellow',
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
              Alumni Connection Platform
            </Typography>
          </Box>

          <Typography fontSize={22}>
            Some description long long descriptioncs sc fwefa vf va fewvdsvafd
            ab csdc ds
          </Typography>

          <Typography fontSize={18}>
            Some description long long descriptioncs sc fwefa vf va fewvdsvafd
            ab csdc ds. Some description long long descriptioncs sc fwefa vf va
            fewvdsvafd ab csdc ds.
          </Typography>

          <Box>
            <Button variant="contained" size="large">
              Gia nhập ngay
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default IntroductionSection;
