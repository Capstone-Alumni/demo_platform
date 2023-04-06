'use client';

import { Box, Card, Container, Stack, styled, Typography } from '@mui/material';
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mt: 10,
      }}
    >
      <Typography sx={{ margin: 'auto' }} variant="h3" color="primary">
        Chúng tôi cung cấp các tính năng
      </Typography>
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
            <Image
              src="/recruite.svg"
              alt="recruite"
              width={200}
              height={200}
            />
            <Typography variant="h4">Tuyển dụng</Typography>
          </StyledBox>
          <StyledBox>
            <Image
              src="/search_friend.svg"
              alt="search_friend"
              width={200}
              height={200}
            />
            <Typography variant="h4">Tìm bạn</Typography>
          </StyledBox>
        </Stack>
        <Typography
          sx={{
            mt: 3,
          }}
          color="GrayText"
          gutterBottom
        >
          Các cựu học sinh có thể cập nhật thông tin mới nhất về trường học và
          những người bạn cũ của mình, đăng thông tin về các sự kiện sắp diễn
          ra, gây quỹ cho các hoạt động của trường, tìm kiếm việc làm hoặc tuyển
          dụng nhân sự và tìm kiếm các bạn cũ của mình.
        </Typography>
      </Container>
      <Box
        sx={{
          height: '50vh',
          backgroundImage: 'url("/alumni_feature_bg.jpg")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
    </Box>
  );
};

export default FeaturesSection;
