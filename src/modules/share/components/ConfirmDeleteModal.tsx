import { useState } from 'react';

import { Box, Button, Modal, Typography, useTheme } from '@mui/material';

const ConfirmDeleteModal = ({
  open,
  title,
  onDelete,
  onClose,
}: {
  open: boolean;
  title: string;
  onDelete: () => void;
  onClose: () => void;
}) => {
  const theme = useTheme();
  const [deleting, setDeleting] = useState(false);

  const onDeleteHandler = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: theme.spacing(2),
          padding: theme.spacing(2),
          border: 1,
          borderColor: theme.palette.divider,
          borderRadius: `${theme.shape.borderRadius}px`,
          backgroundColor: theme.palette.background.neutral,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6">{title}</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: theme.spacing(2),
          }}
        >
          <Button variant="outlined" disabled={deleting} onClick={onClose}>
            Huỷ
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleting}
            onClick={() => onDeleteHandler()}
          >
            Xoá
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteModal;
