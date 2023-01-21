import { Icon } from '@iconify/react';
import { IconButton, TableCell, TableRow, Typography } from '@mui/material';
import ConfirmDeleteModal from '@share/components/ConfirmDeleteModal';
import Link from 'next/link';
import { useState } from 'react';
import { Tenant } from '../types';

const AdminTenantListItem = ({
  data,
  onDelete,
}: {
  data: Tenant;
  onDelete: (id: string) => void;
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell align="left">
          <Typography>{data.logo}</Typography>
        </TableCell>
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
          <Typography>{new Date(data.createdAt).toDateString()}</Typography>
        </TableCell>
        <TableCell align="center" sx={{ maxWidth: '3rem' }}>
          <Link href={`/tenants/${data.id}`}>
            <IconButton>
              <Icon height={24} icon="uil:pen" />
            </IconButton>
          </Link>
        </TableCell>
        <TableCell align="center" sx={{ maxWidth: '3rem' }}>
          <IconButton onClick={() => setOpenDeleteModal(true)}>
            <Icon height={24} icon="uil:trash-alt" />
          </IconButton>
        </TableCell>
      </TableRow>

      <ConfirmDeleteModal
        open={openDeleteModal}
        title="Do you want to delete this tenant?"
        onClose={() => setOpenDeleteModal(false)}
        onDelete={() => onDelete(data.id)}
      />
    </>
  );
};

export default AdminTenantListItem;
