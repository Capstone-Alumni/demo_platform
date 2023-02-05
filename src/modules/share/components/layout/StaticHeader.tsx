'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';

import { Button, Toolbar, useTheme } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Logo from '../Logo';

const StaticHeader = () => {
  const theme = useTheme();
  const { data: session } = useSession();
  const { user } = session || { user: undefined };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="default" position="static" sx={{ borderBottom: 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <Logo />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Alumni Platform
          </Typography>

          {user ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing(2),
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
      </AppBar>
    </Box>
  );
};

export default StaticHeader;
