'use client';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import Groups2Icon from '@mui/icons-material/Groups2';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RememberMeIcon from '@mui/icons-material/RememberMe';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

const SidebarWrapper = styled('div')(({ theme }) => ({
  height: '100vh',
  minWidth: theme.spacing(32),
  paddingTop: theme.spacing(2),
  overflow: 'hidden auto',
  '&::-webkit-overflow-scrolling': 'touch',
  '&::-webkit-scrollbar': {
    width: '10px',
    backgroundColor: '#F5F5F5',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  '&::-webkit-scrollbar-track': {
    '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0)',
    borderRadius: '10px',
    backgroundColor: '#F5F5F5',
  },
}));

const tenantAdminItems = [
  {
    link: '/dashboard/tenants',
    icon: <Groups2Icon />,
    text: 'Khách hàng',
  },
];

const schoolAdminItems = [
  {
    link: '/dashboard/school',
    icon: <AccountBalanceIcon />,
    text: 'Thiết lập trường',
  },
  {
    link: '/dashboard/members',
    icon: <RememberMeIcon />,
    text: 'Danh sách thành viên',
  },
];

const Sidebar = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { user } = session || { user: undefined };

  const items = useMemo(
    () => (user?.isTenantAdmin ? tenantAdminItems : schoolAdminItems),
    [user?.isTenantAdmin],
  );

  return (
    <SidebarWrapper>
      <List>
        {items.map(item => (
          <ListItem key={item.link}>
            <Link href={item.link} style={{ width: '100%' }}>
              <ListItemButton
                selected={pathname?.startsWith(item.link)}
                sx={{ borderRadius: theme.shape.borderRadiusSm }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>
                  <Typography variant="button">{item.text}</Typography>
                </ListItemText>
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </SidebarWrapper>
  );
};

export default Sidebar;
