import { Theme } from '@mui/material';

// ----------------------------------------------------------------------

export default function ToggleButton(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[500],
          border: `solid 1px ${theme.palette.grey[500]}`,
          '&.Mui-selected': {
            color: theme.palette.grey[isLight ? 600 : 50],
            backgroundColor: theme.palette.action.selected,
          },
          '&.Mui-disabled': {
            color: theme.palette.grey[500],
          },
        },
      },
    },
  };
}
