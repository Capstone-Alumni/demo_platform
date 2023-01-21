'use client';

import { Box, useTheme } from '@mui/material';

const AdminBodyWrapper = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        paddingTop: theme.spacing(1.5),
      }}
    >
      <Box
        sx={{
          height: '100%',
          padding: theme.spacing(4),
          borderTopLeftRadius: theme.spacing(4),
          borderBottomLeftRadius: theme.spacing(4),
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminBodyWrapper;
