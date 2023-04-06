'use client';
import { alpha, Box, Stack, styled, Typography } from '@mui/material';
import Image from 'next/image';

const StyledPlanBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  flex: 1,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  borderWidth: '1px',
  borderColor: theme.palette.divider,
  borderStyle: 'solid',
  '&:hover': {
    borderWidth: '2px',
    borderColor: theme.palette.primary.light,
    background: alpha(theme.palette.primary.lighter, 0.15),
  },
}));

const PricingPlan = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '70%',
        flexDirection: 'column',
        mt: 5,
        margin: 'auto',
        mb: 5,
      }}
    >
      <Typography sx={{ margin: 'auto', mb: 5 }} variant="h3" color="primary">
        Các gói
      </Typography>
      <Stack direction={{ md: 'row', sm: 'column' }} gap={2}>
        <StyledPlanBox>
          <Typography variant="h6">Gói 3 tháng</Typography>
          <Typography mb={2}>3,000,000 VNĐ</Typography>
          <Image src="/basic-plan.svg" alt="basic" width={262} height={250} />
        </StyledPlanBox>
        <StyledPlanBox>
          <Typography variant="h6">Gói 6 tháng</Typography>
          <Typography mb={2}>5,000,000 VNĐ</Typography>
          <Image src="/advance-plan.svg" alt="basic" width={250} height={250} />
        </StyledPlanBox>
        <StyledPlanBox>
          <Typography variant="h6">Gói 1 năm</Typography>
          <Typography mb={2}>8,000,000 VNĐ</Typography>
          <Image src="/pro-plan.svg" alt="basic" width={250} height={250} />
        </StyledPlanBox>
      </Stack>
    </Box>
  );
};

export default PricingPlan;
