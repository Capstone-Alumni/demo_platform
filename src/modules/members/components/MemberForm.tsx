import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import * as yup from 'yup';
import {
  requiredEmailValidator,
  requiredPasswordValidator,
} from '@share/utils/validators';

import { Box, Button, TextField, Typography, useTheme } from '@mui/material';

import useYupValidateionResolver from 'src/modules/share/utils/useYupValidationResolver';
import { Member } from '../types';

export type MemberFormValues = {
  email: string;
  password: string;
};

const validationSchema = yup.object({
  email: requiredEmailValidator,
  password: requiredPasswordValidator,
});

const MemberForm = ({
  initialData,
  onClose,
  onSubmit,
}: {
  initialData?: Member;
  onClose?: () => void;
  onSubmit: (values: MemberFormValues) => void;
}) => {
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);

  const resolver = useYupValidateionResolver(validationSchema);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: initialData?.user.email ?? '',
      password: '',
    },
    resolver,
  });

  const onSubmitHandler = async (values: MemberFormValues) => {
    setSubmitting(true);
    await onSubmit(values);
    setSubmitting(false);
    onClose?.();
  };

  return (
    <Box
      sx={{
        width: '100%',
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
        <Typography variant="h6">
          {initialData
            ? 'Chỉnh sửa thông tin thanh vien'
            : 'Thêm thanh vien mới'}
        </Typography>
      </Box>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            fullWidth
            label="Email"
            {...field}
            disabled={!!initialData?.user.email}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextField fullWidth label="Mat khau" type="password" {...field} />
        )}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing(2),
        }}
      >
        {onClose ? (
          <Button variant="outlined" disabled={submitting} onClick={onClose}>
            Huỷ
          </Button>
        ) : null}
        <Button
          variant="contained"
          disabled={submitting}
          onClick={handleSubmit(onSubmitHandler)}
        >
          Lưu
        </Button>
      </Box>
    </Box>
  );
};

export default MemberForm;
