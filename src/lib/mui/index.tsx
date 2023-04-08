import { ReactNode, useMemo } from 'react';
// material
import {
  createTheme,
  CssBaseline,
  // ThemeOptions,
  ThemeProvider,
} from '@mui/material';
import type { ThemeOptions } from '@mui/material';
// hooks
// import useSettings from '../hooks/useSettings';
//
import shape from './shape';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

// ----------------------------------------------------------------------

type ThemeConfigProps = {
  children: ReactNode;
};

export default function ThemeConfig({ children }: ThemeConfigProps) {
  const themeOptions: ThemeOptions = {
    palette: { ...palette.light, mode: 'light' },
    shape,
    typography,
    breakpoints,
    shadows: shadows.light,
    customShadows: customShadows.light,
  };

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}
