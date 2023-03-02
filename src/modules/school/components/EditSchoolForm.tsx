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
import UploadBackgroundInput from '@share/components/form/UploadBackgroundInput';
import UploadAvatarInput from '@share/components/form/UploadAvatarInput';
import RichTextInput from '@share/components/form/RichTextInput';

export type EditSChoolFormValues = {
  email: string;
  tenantId: string;
  subdomain: string;
  logo?: string;
  name: string;
  theme?: string;
  description?: string;
  background1?: string;
  background2?: string;
  background3?: string;
};

const MAINAPP_DOMAIN = '.vercel.app';

const validationSchema = yup.object({
  subdomain: yup.string().required(),
  logo: yup.string(),
  name: yup.string().required(),
  theme: yup.string(),
  description: yup.string(),
  background1: yup.string(),
  background2: yup.string(),
  background3: yup.string(),
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
      background1: initialData?.background1 ?? '',
      background2: initialData?.background2 ?? '',
      background3: initialData?.background3 ?? '',
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
        <UploadAvatarInput
          control={control}
          name="logo"
          inputProps={{ label: 'Logo trường', sx: { margin: 0 } }}
        />
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <UploadBackgroundInput
          control={control}
          name="background1"
          inputProps={{ label: 'Hình nền 1', sx: { margin: 0 } }}
        />

        <UploadBackgroundInput
          control={control}
          name="background2"
          inputProps={{ label: 'Hình nền 2', sx: { margin: 0 } }}
        />

        <UploadBackgroundInput
          control={control}
          name="background3"
          inputProps={{ label: 'Hình nền 3', sx: { margin: 0 } }}
        />
      </Box>

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField fullWidth label="Tên trường" {...field} />
        )}
      />

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
              disabled={!initialData.activated}
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
      </Box>

      <RichTextInput
        control={control}
        name="description"
        inputProps={{
          placeholder: 'Hãy mô tả thêm về trường',
          containerSx: {
            width: '100%',
          },
        }}
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
