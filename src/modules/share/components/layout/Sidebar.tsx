'use client';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

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
    text: 'Khách hàng',
  },
  {
    link: '/dashboard/transaction',
    text: 'Giao dịch',
  },
];

const Sidebar = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const searchParam = useSearchParams();
  const planSearchParams = searchParam.get('plan') || '3-month';

  return (
    <SidebarWrapper>
      <List>
        {tenantAdminItems.map(item => (
          <ListItem key={item.link}>
            <Link href={item.link} style={{ width: '100%' }}>
              <ListItemButton
                selected={`${pathname}?plan=${planSearchParams}`?.startsWith(
                  item.link,
                )}
                sx={{ borderRadius: theme.shape.borderRadiusSm }}
              >
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
