'use client';

import { signOut, useSession } from 'next-auth/react';

import { Button, Toolbar, useTheme } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Logo from '../Logo';

const Header = () => {
  const theme = useTheme();
  const { data: session } = useSession();
  const { user } = session || { user: undefined };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Logo />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Platform
          </Typography>
          {user ? (
            <>
              <Typography>{user?.email}</Typography>
              <Button color="inherit" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing(2),
              }}
            >
              <Link
                href="/register_tenant"
                style={{ textDecoration: 'none', textUnderlineOffset: 0 }}
              >
                <Button variant="outlined">Đăng ký</Button>
              </Link>
              <Link
                href="/login"
                style={{ textDecoration: 'none', textUnderlineOffset: 0 }}
              >
                <Button variant="contained">Đăng nhập</Button>
              </Link>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
