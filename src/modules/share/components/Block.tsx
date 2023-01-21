import { Box, BoxProps, Paper, Typography, useTheme } from '@mui/material';

// ----------------------------------------------------------------------

interface BlockProps extends BoxProps {
  title?: string;
}

export default function Block({ children, title, sx, ...other }: BlockProps) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Box sx={{ position: 'relative' }} {...other}>
      {title && (
        <Typography
          gutterBottom
          variant="subtitle2"
          sx={{ color: 'text.secondary' }}
        >
          {title}
        </Typography>
      )}
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          minHeight: 160,
          borderRadius: 1.5,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          // eslint-disable-next-line prettier/prettier
          bgcolor: (theme) => theme.palette.grey[isLight ? 100 : 800],
          '& > *': { m: '8px !important' },
          ...sx,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}
