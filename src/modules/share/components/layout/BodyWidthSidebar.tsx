'use client';

import { Box, Container, useTheme } from '@mui/material';
import React from 'react';
import Sidebar from './Sidebar';

const BodyWithSidebar = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Sidebar />
      <Container
        sx={{
          paddingTop: theme.spacing(4),
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          paddingBottom: theme.spacing(4),
          backgroundColor: theme.palette.background.neutral,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default BodyWithSidebar;
