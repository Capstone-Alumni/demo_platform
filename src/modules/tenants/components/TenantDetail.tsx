'use client';

import { Box, Divider, Paper, Typography, useTheme } from '@mui/material';

import { Tenant } from '../types';
import UploadAvatar from '@share/components/upload/UploadAvatar';
import { Stack } from '@mui/material';

const TenantDetail = ({ initialData }: { initialData: Tenant }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: theme.spacing(2),
        padding: theme.spacing(2),
        border: 1,
        borderColor: theme.palette.divider,
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6">Người quản lý</Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Typography fontWeight={600}>Email</Typography>
        <Typography>{initialData.alumni[0]?.accountEmail}</Typography>
      </Box>

      <Divider sx={{ width: '100%' }} />

      <Box sx={{ width: '100%' }}>
        <Typography variant="h6">Thông tin trường</Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
        }}
      >
        <Typography fontWeight={600}>Logo</Typography>
        <UploadAvatar disabled file={initialData.logo} sx={{ margin: 0 }} />
      </Box>

      <Stack direction="row" sx={{ width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <Typography fontWeight={600}>Subdomain</Typography>
          <Typography>{initialData.subdomain}</Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography fontWeight={600}>Tên trường</Typography>
          <Typography>{initialData.name}</Typography>
        </Box>
      </Stack>

      <Stack direction="row" sx={{ width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <Typography fontWeight={600}>Tỉnh/thành phố</Typography>
          <Typography>{initialData.provinceName}</Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography fontWeight={600}>Quận/huyện</Typography>
          <Typography>{initialData.cityName}</Typography>
        </Box>
      </Stack>

      <Box sx={{ width: '100%' }}>
        <Typography fontWeight={600}>Địa chỉ</Typography>
        <Typography>{initialData.address}</Typography>
      </Box>

      <Divider sx={{ width: '100%' }} />

      <Box sx={{ width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6">Văn bản</Typography>
        </Box>
        <a href={initialData.evidenceUrl} target="_blank">
          <Typography>File</Typography>
        </a>
      </Box>
    </Paper>
  );
};

export default TenantDetail;
