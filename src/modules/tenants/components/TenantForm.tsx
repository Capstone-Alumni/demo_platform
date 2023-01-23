'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import * as yup from 'yup';

import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import useYupValidateionResolver from 'src/modules/share/utils/useYupValidationResolver';
import { Tenant } from '../types';

export type TenantFormValues = {
  email: string;
  password: string;
  tenantId: string;
  name: string;
  subdomain: string;
  description?: string;
};

const MAINAPP_DOMAIN = '.vercel.app';

const validationSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
  tenantId: yup.string().required(),
  name: yup.string().required(),
  subdomain: yup.string().required(),
  description: yup.string(),
});

const TenantForm = ({
  initialData,
  onClose,
  onSubmit,
}: {
  initialData?: Tenant;
  onClose?: () => void;
  onSubmit: (values: TenantFormValues) => Promise<void>;
}) => {
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);

  const resolver = useYupValidateionResolver(validationSchema);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      tenantId: initialData?.tenantId ?? '',
      name: initialData?.name ?? '',
      subdomain: initialData?.subdomain ?? '',
      description: initialData?.description ?? '',
    },
    resolver,
  });

  const onSubmitHandler = async (values: TenantFormValues) => {
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
          {initialData ? 'Edit tenant information' : 'Add new tenant'}
        </Typography>
      </Box>

      <Controller
        control={control}
        name="email"
        render={({ field }) => <TextField fullWidth label="email" {...field} />}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextField fullWidth label="password" {...field} />
        )}
      />

      <Controller
        control={control}
        name="tenantId"
        render={({ field }) => (
          <TextField fullWidth label="Tenant Id" {...field} />
        )}
      />

      <Controller
        control={control}
        name="name"
        render={({ field }) => <TextField fullWidth label="Name" {...field} />}
      />

      <Controller
        control={control}
        name="subdomain"
        render={({ field }) => (
          <TextField
            fullWidth
            label="Subdomain"
            {...field}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{MAINAPP_DOMAIN}</InputAdornment>
              ),
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextField fullWidth label="Description" multiline {...field} />
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
            Cancel
          </Button>
        ) : null}
        <Button
          variant="contained"
          disabled={submitting}
          onClick={handleSubmit(onSubmitHandler)}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TenantForm;
