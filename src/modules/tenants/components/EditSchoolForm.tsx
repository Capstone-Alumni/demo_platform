'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import * as yup from 'yup';

import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import useYupValidateionResolver from 'src/modules/share/utils/useYupValidationResolver';
import { Tenant } from '../types';
import UploadAvatar from '@share/components/upload/UploadAvatar';

export type EditSChoolFormValues = {
  email: string;
  tenantId: string;
  subdomain: string;
  logo?: string;
  name: string;
  theme?: string;
  description?: string;
};

const MAINAPP_DOMAIN = '.vercel.app';

const validationSchema = yup.object({
  subdomain: yup.string().required(),
  logo: yup.string(),
  name: yup.string().required(),
  theme: yup.string(),
  description: yup.string(),
});

const EditSChoolForm = ({
  initialData,
  onSubmit,
}: {
  initialData: Tenant;
  onSubmit: (values: EditSChoolFormValues) => Promise<void>;
}) => {
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);

  const resolver = useYupValidateionResolver(validationSchema);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      subdomain: initialData?.subdomain ?? '',
      logo: initialData?.logo ?? '',
      name: initialData?.name ?? '',
      theme: initialData?.theme,
      description: initialData?.description ?? '',
    },
    resolver,
  });

  const onSubmitHandler = async (values: EditSChoolFormValues) => {
    setSubmitting(true);
    await onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Paper
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
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Controller
          control={control}
          name="logo"
          render={({ field }) => (
            <UploadAvatar
              file={field.value}
              {...field}
              onDrop={files => {
                console.log('on drop', files);
              }}
              sx={{ margin: 0 }}
            />
          )}
        />
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing(2),
        }}
      >
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
                  <InputAdornment position="end">
                    {MAINAPP_DOMAIN}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField fullWidth label="Tên trường" {...field} />
          )}
        />
      </Box>

      <Controller
        name="theme"
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            variant="outlined"
            label="Màu chủ đạo"
            select
            type="select"
            {...field}
          >
            {[
              { id: 'purple', value: 'purple', label: 'Tím' },
              { id: 'green', value: 'green', label: 'Xanh lá' },
            ]?.map(option => (
              <MenuItem key={option.id} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextField fullWidth label="Mô tả" multiline {...field} />
        )}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing(2),
        }}
      >
        <Button
          variant="contained"
          disabled={submitting}
          onClick={handleSubmit(onSubmitHandler)}
        >
          Lưu
        </Button>
      </Box>
    </Paper>
  );
};

export default EditSChoolForm;
