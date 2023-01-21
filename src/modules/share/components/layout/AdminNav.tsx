'use client';

import { Icon } from '@iconify/react';

import {
  Avatar,
  Box,
  IconButton,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const ACCESS_NAV_ITEM = {
  id: 'request_access',
  title: 'Kiểm duyệt thành viên',
  icon: 'material-symbols:meeting-room-outline-rounded',
  link: '/admin/access_request',
};
const GRADE_NAV_ITEM = {
  id: 'grade_class',
  title: 'Niên khoá và Lớp',
  icon: 'material-symbols:meeting-room-outline-rounded',
  link: '/admin/grade',
};
const USER_NAV_ITEM = {
  id: 'user',
  title: 'Người dùng',
  icon: 'material-symbols:meeting-room-outline-rounded',
  link: '/admin/user',
};
const NEWS_NAV_ITEM = {
  id: 'news',
  title: 'Tin tức',
  icon: 'material-symbols:meeting-room-outline-rounded',
  link: '/admin/event',
};
const FUND_NAV_ITEM = {
  id: 'grade_class_4',
  title: 'Quỹ',
  icon: 'material-symbols:meeting-room-outline-rounded',
  link: '/admin/fund',
};

const StyledSidebar = styled(Box)(() => ({
  height: '100vh',
  width: '20rem',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',

  overflowY: 'auto',
}));

const StyledNavWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingTop: theme.spacing(4),
  gap: theme.spacing(3),
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const StyledNav = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const StyledNavItem = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),

  borderRadius: theme.spacing(2),

  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(3),
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const StyledAccountWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  paddingTop: theme.spacing(3),
  paddingRight: theme.spacing(4),
  paddingLeft: theme.spacing(1),
  paddingBottom: theme.spacing(0),
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: theme.palette.primary.contrastText,
}));

const generateNavItems = (
  role: 'ALUMNI' | 'CLASS_MOD' | 'GRADE_MOD' | 'SCHOOL_ADMIN',
) => {
  switch (role) {
    case 'ALUMNI':
      return [];
    case 'CLASS_MOD':
      return [ACCESS_NAV_ITEM, NEWS_NAV_ITEM];
    case 'GRADE_MOD':
      return [ACCESS_NAV_ITEM, NEWS_NAV_ITEM, USER_NAV_ITEM];
    case 'SCHOOL_ADMIN':
      return [
        ACCESS_NAV_ITEM,
        NEWS_NAV_ITEM,
        FUND_NAV_ITEM,
        GRADE_NAV_ITEM,
        USER_NAV_ITEM,
      ];
  }
};

const AdminNav = ({ user }: { user?: any }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledSidebar>
        <StyledNavWrapper>
          <StyledHeader
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Image src="/logo.png" alt="logo" width={32} height={32} />
              <Typography variant="h5" sx={{ ml: theme.spacing(1) }}>
                Alumni Hub
              </Typography>
            </Box>
          </StyledHeader>

          <StyledNav>
            {generateNavItems(user.accessLevel).map(item => {
              const isActive = item.link && pathname?.startsWith(item.link);
              return (
                <StyledNavItem
                  key={item.id}
                  sx={{
                    backgroundColor: isActive
                      ? theme.palette.primary.dark
                      : undefined,
                  }}
                  onClick={() => router.push(item.link)}
                >
                  <Icon height={24} icon={item.icon} />
                  <Typography fontWeight={600}>{item.title}</Typography>
                  <Box sx={{ flex: 1 }} />
                  <Icon
                    height={24}
                    icon={
                      isActive
                        ? 'material-symbols:keyboard-arrow-right'
                        : 'material-symbols:keyboard-arrow-down-rounded'
                    }
                  />
                </StyledNavItem>
              );
            })}
          </StyledNav>
        </StyledNavWrapper>

        <StyledFooter>
          <StyledNav sx={{ padding: 0 }}>
            <StyledNavItem>
              <Icon height={24} icon="icon-park-outline:setting-two" />
              <Typography fontWeight={600}>Cài đặt</Typography>
            </StyledNavItem>

            <StyledNavItem onClick={() => router.push('/')}>
              <Icon height={24} icon="majesticons:door-exit" />
              <Typography fontWeight={600}>Thoát chế độ admin</Typography>
            </StyledNavItem>
          </StyledNav>

          <StyledAccountWrapper>
            <Avatar src={user.image} />
            <Box>
              <Typography variant="body2">{user.name}</Typography>
              <Typography variant="caption">{user.email}</Typography>
            </Box>

            <IconButton
              sx={{
                position: 'absolute',
                right: 0,
                top: theme.spacing(3),
              }}
            >
              <Icon
                color={theme.palette.primary.contrastText}
                height={32}
                icon="fe:logout"
              />
            </IconButton>
          </StyledAccountWrapper>
        </StyledFooter>
      </StyledSidebar>
    </Box>
  );
};

export default AdminNav;
