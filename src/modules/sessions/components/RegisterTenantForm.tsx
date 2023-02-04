'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import * as yup from 'yup';

import { Box, Button, TextField, Typography, useTheme } from '@mui/material';

import useYupValidateionResolver from 'src/modules/share/utils/useYupValidationResolver';
import {
  requiredEmailValidator,
  requiredPasswordValidator,
} from '@share/utils/validators';
import Logo from '@share/components/Logo';

export type RegisterTenantFormValues = {
  email: string;
  password: string;
  name: string;
};

const validationSchema = yup.object({
  email: requiredEmailValidator,
  password: requiredPasswordValidator,
  name: yup.string().required(),
});

const RegisterTenantForm = ({
  onSubmit,
}: {
  onSubmit: (values: RegisterTenantFormValues) => Promise<void>;
}) => {
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);

  const resolver = useYupValidateionResolver(validationSchema);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
    resolver,
  });

  const onSubmitHandler = async (values: RegisterTenantFormValues) => {
    setSubmitting(true);
    await onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        width: theme.spacing(50),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: theme.spacing(2),
        padding: theme.spacing(2),
        border: 1,
        borderColor: theme.palette.divider,
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: theme.spacing(1),
        }}
      >
        <Logo height={80} width={80} />
        <Typography variant="h6" fontWeight="bold">
          Đăng ký trường
        </Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Typography variant="body1" fontWeight="bold">
          Tài khoản quản lý
        </Typography>
      </Box>

      <Controller
        control={control}
        name="email"
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            label="Email"
            {...field}
            error={Boolean(error?.message)}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            {...field}
            error={Boolean(error?.message)}
            helperText={error?.message}
          />
        )}
      />

      <Box sx={{ width: '100%' }}>
        <Typography variant="body1" fontWeight="bold">
          Thông tin trường
        </Typography>
      </Box>

      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error } }) => (
          <TextField
            fullWidth
            label="Tên trường"
            {...field}
            error={Boolean(error?.message)}
            helperText={error?.message}
          />
        )}
      />

      <Button
        variant="contained"
        disabled={submitting}
        onClick={handleSubmit(onSubmitHandler)}
      >
        Đăng ký
      </Button>
    </Box>
  );
};

export default RegisterTenantForm;
