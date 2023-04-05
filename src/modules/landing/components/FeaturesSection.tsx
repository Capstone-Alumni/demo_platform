'use client';

import { Container, Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';

const StyledBox = styled('div')(({ theme }) => ({
  minWidth: '250px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  borderColor: theme.palette.primary.light,
  borderStyle: 'solid',
  borderWidth: '1px',
  boxShadow: theme.shadows[4],

  '&:hover': {
    boxShadow: theme.shadows[10],
  },
}));

const FeaturesSection = () => {
  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Stack
        direction={{ sm: 'column', md: 'row' }}
        gap={3}
        justifyContent="center"
        alignItems="center"
      >
        <StyledBox>
          <Image src="/news.svg" alt="news" width={200} height={200} />
          <Typography variant="h4">Tin tức</Typography>
        </StyledBox>

        <StyledBox>
          <Image src="/event.svg" alt="event" width={200} height={200} />
          <Typography variant="h4">Sự kiện</Typography>
        </StyledBox>

        <StyledBox>
          <Image src="/fund.svg" alt="fund" width={200} height={200} />
          <Typography variant="h4">Gây quỹ</Typography>
        </StyledBox>

        <StyledBox>
          <Image src="/recruite.svg" alt="recruite" width={200} height={200} />
          <Typography variant="h4">Tuyển dụng</Typography>
        </StyledBox>
      </Stack>
    </Container>
  );
};

export default FeaturesSection;
