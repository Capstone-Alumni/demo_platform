import { ListItemIcon, MenuItem } from '@mui/material';
import { Menu } from '@mui/material';
import {
  Button,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ConfirmDeleteModal from '@share/components/ConfirmDeleteModal';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import { Tenant } from '../types';
import { ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';
import { noop } from 'lodash/fp';

const ActionButton = ({
  actions,
}: {
  actions: Array<{
    id: string;
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
  }>;
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
        {actions.map(action => (
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
        ))}
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const router = useRouter();

  return (
    <>
      <TableRow>
        <TableCell align="left">
          <Typography>{data.tenantId}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>{data.name}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>{data.subdomain}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography>{data.members?.[0].user.email}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography>
            {data.activated ? (
              <Button variant="outlined" size="small" color="success">
                Đã kích hoạt
              </Button>
            ) : (
              <Button variant="outlined" size="small" color="warning">
                Chưa kích hoạt
              </Button>
            )}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <ActionButton
            actions={[
              {
                id: 'edit',
                icon: <BorderColorIcon />,
                text: 'Chỉnh sửa',
                onClick: data.activated
                  ? () => router.push(`/dashboard/tenants/${data.id}`)
                  : noop,
              },
              data.activated
                ? {
                    id: 'deactivate',
                    icon: <LightbulbIcon color="warning" />,
                    text: 'Huỷ kích hoạt',
                    onClick: () => onDeactivate(data.id),
                  }
                : {
                    id: 'activate',
                    icon: <LightbulbIcon color="primary" />,
                    text: 'Kích hoạt',
                    onClick: () => onActivate(data.id),
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
