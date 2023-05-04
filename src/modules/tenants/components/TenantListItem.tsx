import { ListItemIcon, MenuItem, Stack, useTheme } from '@mui/material';
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
import { differenceInDays } from 'date-fns';
import useResendPaymentTenantById from '../hooks/useResendPaymentTenant';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { isEmpty } from 'lodash';
import getSubscriptionDisplay from '@share/utils/getSubscriptionDisplay';

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

  const { resendPaymentTenantById, isLoading: resending } =
    useResendPaymentTenantById();

  const isNearEndTime =
    data.requestStatus === 1 &&
    data._count?.transactions &&
    differenceInDays(new Date(data.subscriptionEndTime ?? ''), new Date()) <=
      10;

  const hasTransaction = data.requestStatus && data._count?.transactions;

  const getTenantStatus = () => {
    if (data.requestStatus === 0) {
      return 'Đang chờ xác thực';
    }
    if (data.requestStatus === 2) {
      return 'Đã từ chối';
    }
    if (data.requestStatus && isEmpty(data.transactions)) {
      return 'Đang chờ thanh toán';
    }
    if (data.transactions) {
      return 'Đã thanh toán';
    }
  };

  const getTenantStatusColor = () => {
    if (data.requestStatus === 0) {
      return theme.palette.warning.main;
    }
    if (data.requestStatus === 2) {
      return theme.palette.error.main;
    }
    if (data.requestStatus && isEmpty(data.transactions)) {
      return '#0288d1';
    }
  };

  console.log(
    hasTransaction
      ? formatDate(new Date(data?.subscriptionEndTime || ''))
      : data?.requestStatus === 1,
  );

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
          <Typography>{getSubscriptionDisplay(data.plan?.name)}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>{data.alumni?.[0]?.accountEmail}</Typography>
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
          {data.paymentToken ? (
            <Stack direction="row">
              <WarningAmberIcon color="warning" />
              <Typography>Đã gửi yêu cầu thanh toán</Typography>
            </Stack>
          ) : null}
          <Typography
            color={isNearEndTime ? 'error' : ''}
            fontWeight={isNearEndTime ? 600 : undefined}
          >
            {hasTransaction
              ? formatDate(new Date(data?.subscriptionEndTime || ''))
              : data?.requestStatus === 1
              ? ''
              : 'Chưa thanh toán'}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <ActionButton
            actions={[
              hasTransaction && isNearEndTime
                ? {
                    id: 'reminder',
                    icon: <NotificationsNoneIcon color="inherit" />,
                    text: 'Nhắc nhở gia hạn',
                    onClick: () => resendPaymentTenantById({ id: data.id }),
                  }
                : null,
              data.requestStatus && !isEmpty(data.transactions)
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
