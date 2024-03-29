'use client';

import React, { useMemo } from 'react';
import { signOut, useSession } from 'next-auth/react';

import { Button, Toolbar, useScrollTrigger, useTheme } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Logo from '../Logo';
import { Container } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
  isStatic?: boolean;
}

function ElevationScroll(props: Props) {
  const { children, window, isStatic } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger && !isStatic ? 4 : 0,
    color: trigger || isStatic ? 'default' : 'transparent',
  });
}

const Header = ({ session }: { session: Session | null }) => {
  const theme = useTheme();
  const { user } = session || { user: undefined };

  const pathname = usePathname();

  const isStatic = useMemo(
    () => pathname?.startsWith('/dashboard'),
    [pathname],
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ElevationScroll isStatic={isStatic}>
        <AppBar color="inherit" position={isStatic ? 'static' : undefined}>
          <Container maxWidth={false}>
            <Toolbar disableGutters>
              <Link href="/">
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                  >
                    <Logo />
                  </IconButton>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, margin: 'auto' }}
                  >
                    Alumni Platform
                  </Typography>
                </Box>
              </Link>

              {session?.user ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing(2),
                    marginLeft: 'auto',
                  }}
                >
                  <Typography>{user?.email}</Typography>
                  <Link
                    href="/dashboard"
                    style={{ textDecoration: 'none', textUnderlineOffset: 0 }}
                  >
                    <Button color="warning" variant="outlined">
                      Bảng điều khiển
                    </Button>
                  </Link>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => signOut()}
                  >
                    Đăng xuất
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing(2),
                    marginLeft: 'auto',
                  }}
                >
                  <Link
                    href="/login"
                    style={{ textDecoration: 'none', textUnderlineOffset: 0 }}
                  >
                    <Button variant="outlined">Đăng nhập</Button>
                  </Link>
                  <Link
                    href="/register_tenant"
                    style={{ textDecoration: 'none', textUnderlineOffset: 0 }}
                  >
                    <Button variant="contained">Đăng ký</Button>
                  </Link>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
    </Box>
  );
};

export default Header;
