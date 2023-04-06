'use client';

import { Box, Container, Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';

const StyledBox = styled('div')(({ theme }) => ({
  width: '350px',
  display: 'flex',
  flexDirection: 'row',
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

const RegisterStep = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mt: 5,
      }}
    >
      <Typography sx={{ margin: 'auto' }} variant="h3" color="primary">
        Đăng ký đơn giản
      </Typography>
      <Container sx={{ mt: 4, mb: 6 }}>
        <Stack
          gap={3}
          sx={{
            width: '60%',
            margin: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <StyledBox>
              <Typography
                sx={{
                  mr: 1,
                }}
                variant="h4"
              >
                Chọn gói
              </Typography>
              <Image
                src="/pricing_plan.svg"
                alt="choose pricing"
                width={200}
                height={200}
              />
            </StyledBox>
            <Image
              style={{ margin: 'auto', marginLeft: '30px' }}
              src="/arrow.svg"
              alt="arrow down right"
              width={200}
              height={200}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Image
              style={{ margin: 'auto', marginRight: '30px' }}
              src="/arrow_down_left.svg"
              alt="arrow down left"
              width={200}
              height={200}
            />
            <StyledBox
              sx={{
                marginLeft: 'auto',
              }}
            >
              <Image
                src="/fill_out-bro.svg"
                alt="fill out"
                width={200}
                height={200}
              />
              <Typography
                sx={{
                  ml: 2,
                }}
                variant="h4"
              >
                Đăng ký thông tin trường
              </Typography>
            </StyledBox>
          </Box>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <StyledBox>
              <Typography
                sx={{
                  ml: 1,
                }}
                variant="h4"
              >
                Thanh toán
              </Typography>
              <Image
                src="/E-Wallet-bro.svg"
                alt="payment"
                width={200}
                height={200}
              />
            </StyledBox>
            <Image
              style={{ margin: 'auto', marginLeft: '30px' }}
              src="/arrow.svg"
              alt="arrow down right"
              width={200}
              height={200}
            />
          </Box>
          <StyledBox
            sx={{
              marginLeft: 'auto',
            }}
          >
            <Image
              src="/launch-cuate.svg"
              alt="launching"
              width={200}
              height={200}
            />
            <Typography
              sx={{
                ml: 1,
              }}
              variant="h4"
            >
              Sử dụng
            </Typography>
          </StyledBox>
        </Stack>
      </Container>
    </Box>
  );
};

export default RegisterStep;
