import { ListItemIcon, MenuItem, useTheme } from '@mui/material';
import { Menu } from '@mui/material';
import {
  Button,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ConfirmDeleteModal from '@share/components/ConfirmDeleteModal';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import React, { useState } from 'react';
import { Tenant } from '../types';
import { ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';
import { noop } from 'lodash/fp';
import getTenantHost from '../utils/getTenantHost';
import { formatDate } from '@share/utils/formatDate';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { isEmpty } from 'lodash';

const ActionButton = ({
  actions,
}: {
  actions: Array<{
    id: string;
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
  } | null>;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {actions.map(action =>
          action === null ? undefined : (
            <MenuItem
              key={action.id}
              onClick={async () => {
                await action.onClick();
                handleClose();
              }}
            >
              <ListItemIcon>{action.icon}</ListItemIcon>
              <ListItemText>{action.text}</ListItemText>
            </MenuItem>
          ),
        )}
      </Menu>
    </div>
  );
};

const AdminTenantListItem = ({
  data,
  onDelete,
  onActivate,
  onDeactivate,
}: {
  data: Tenant;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
}) => {
  const theme = useTheme();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const router = useRouter();

  const isWaitForPay =
    data.requestStatus &&
    (isEmpty(data.transactions) ||
      !data.transactions?.some(transaction => transaction.paymentStatus === 1));

  const isPaid =
    data.requestStatus &&
    data.transactions?.some(transaction => transaction.paymentStatus === 1);

  const getTenantStatus = () => {
    if (data.requestStatus === 0) {
      return 'Đang chờ xác thực';
    }
    if (data.requestStatus === 2) {
      return 'Đã từ chối';
    }
    if (isPaid) {
      return 'Đã thanh toán';
    }
    if (!data.requestStatus) {
      return 'Đang chờ xác thực';
    }
    return 'Đã xác thực';
  };

  const getTenantStatusColor = () => {
    if (data.requestStatus === 0) {
      return theme.palette.warning.main;
    }
    if (data.requestStatus === 2) {
      return theme.palette.error.main;
    }
    if (isWaitForPay) {
      return '#0288d1';
    }
    if (isPaid) {
      return '#689f38';
    }
    if (!data.requestStatus) {
      return '#fbc02d';
    }
    return '#29b6f6';
  };

  return (
    <>
      <TableRow>
        <TableCell align="left">
          <Typography>{data.name}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>{data.subdomain}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>{data.alumni?.[0]?.account.email}</Typography>
        </TableCell>
        <TableCell align="center">
          <Button
            variant="outlined"
            sx={{
              color: getTenantStatusColor(),
              borderColor: getTenantStatusColor(),
            }}
          >
            {getTenantStatus()}
          </Button>
        </TableCell>
        <TableCell align="center">
          <Typography>
            {data.requestStatus === 1
              ? formatDate(new Date(data?.subscriptionEndTime || ''))
              : ''}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <ActionButton
            actions={[
              isPaid
                ? {
                    id: 'reminder',
                    icon: <NotificationsNoneIcon color="inherit" />,
                    text: 'Nhắc nhở gia hạn',
                    onClick: () => noop,
                  }
                : null,
              data.requestStatus && data.subdomain
                ? {
                    id: 'view',
                    icon: <OpenInNewIcon />,
                    text: 'Truy cập',
                    onClick: () =>
                      window.open(
                        getTenantHost(data.subdomain || ''),
                        '_blank',
                      ),
                  }
                : null,
              {
                id: 'edit',
                icon: <RemoveRedEyeOutlinedIcon />,
                text: 'Chi tiết',
                onClick: () => router.push(`/dashboard/tenants/${data.id}`),
              },
              {
                id: 'delete',
                icon: <DeleteIcon color="error" />,
                text: 'Xoá',
                onClick: () => setOpenDeleteModal(true),
              },
            ]}
          />
        </TableCell>
      </TableRow>

      <ConfirmDeleteModal
        open={openDeleteModal}
        title="Thao tác này không thể hoàn tác, bạn chắc chắn muốn thực hiện?"
        onClose={() => setOpenDeleteModal(false)}
        onDelete={() => onDelete(data.id)}
      />
    </>
  );
};

export default AdminTenantListItem;
