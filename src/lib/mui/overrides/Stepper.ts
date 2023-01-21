import { Theme } from '@mui/material';

// ----------------------------------------------------------------------

export default function Stepper(theme: Theme) {
  return {
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: theme.palette.divider,
        },
      },
    },
  };
}

export function StepLabel(theme: Theme) {
  return {
    MuiStepLabel: {
      styleOverrides: {
        root: {},
      },
    },
  };
}
