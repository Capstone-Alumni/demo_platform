'use client';

import { Container, useTheme } from '@mui/material';
import React from 'react';

const Body = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <Container
      sx={{
        height: '100%',
        paddingTop: theme.spacing(10),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(4),
      }}
    >
      {children}
    </Container>
  );
};

export default Body;
