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
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarWrapper = styled('div')(({ theme }) => ({
  height: '100vh',
  minWidth: theme.spacing(28),
  paddingTop: theme.spacing(8),
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

const Sidebar = () => {
  const theme = useTheme();
  const pathname = usePathname();

  const items = [
    {
      link: '/dashboard/tenants',
      icon: <Groups2Icon />,
      text: 'Khách hàng',
    },
    {
      link: '/dashboard/your_school',
      icon: <Groups2Icon />,
      text: 'Truong cua ban',
    },
    {
      link: '/dashboard/your_members',
      icon: <Groups2Icon />,
      text: 'Thanh vien',
    },
  ];

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
