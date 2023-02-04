'use client';

import { BoxProps, Container, useTheme } from '@mui/material';
import React from 'react';

const Body = ({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: BoxProps;
}) => {
  const theme = useTheme();

  return (
    <Container
      sx={{
        minHeight: '100vh',
        height: '100%',
        paddingTop: theme.spacing(10),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(4),
        ...sx,
      }}
    >
      {children}
    </Container>
  );
};

export default Body;
