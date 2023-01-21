'use client';

import { Box, styled } from '@mui/material';

const AdminLayoutWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',

  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

export default AdminLayoutWrapper;
