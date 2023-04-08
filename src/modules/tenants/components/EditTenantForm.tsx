'use client';

import { useMemo, useState } from 'react';
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
import UploadAvatarInput from '@share/components/form/UploadAvatarInput';
import RichTextInput from '@share/components/form/RichTextInput';
import UploadBackgroundInput from '@share/components/form/UploadBackgroundInput';
import SelectInput from '@share/components/form/SelectInput';
import { getCityList, getProvinceList } from '@share/utils/getLocaltionList';
import EditorPreview from '@share/components/editor/EditorPreview';

export type EditTenantFormValues = {
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
  provinceCodename: string;
  provinceName: string;
  cityCodename: string;
  cityName: string;
  address: string;
};

const MAINAPP_DOMAIN = '.vercel.app';

const validationSchema = yup.object({
  email: yup.string().required(),
  tenantId: yup.string().required(),
  subdomain: yup.string().required(),
  logo: yup.string(),
  background1: yup.string(),
  background2: yup.string(),
  background3: yup.string(),
  name: yup.string().required(),
  theme: yup.string(),
  description: yup.string(),
  // provinceCodename: yup.string(),
  provinceName: yup.string(),
  // cityCodename: yup.string(),
  cityName: yup.string(),
  address: yup.string(),
});

const EditTenantForm = ({
  editable = true,
  initialData,
  onClose,
  onSubmit,
}: {
  editable?: boolean;
  initialData: Tenant;
  onClose?: () => void;
  onSubmit?: (values: EditTenantFormValues) => Promise<void>;
}) => {
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);

  const resolver = useYupValidateionResolver(validationSchema);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: initialData.alumni[0].account.email,
      tenantId: initialData.tenantId ?? '',
      subdomain: initialData?.subdomain ?? '',
      logo: initialData?.logo ?? '',
      background1: initialData?.background1 ?? '',
      background2: initialData?.background2 ?? '',
      background3: initialData?.background3 ?? '',
      name: initialData?.name ?? '',
      theme: initialData?.theme,
      description: initialData?.description ?? '',
      // provinceCodename: initialData?.provinceCodename ?? '',
      provinceName: initialData?.provinceName ?? '',
      // cityCodename: initialData?.cityCodename ?? '',
      cityName: initialData?.cityName ?? '',
      address: initialData?.address || '',
    },
    resolver,
  });

  // const provinceCodenameWatcher = watch('provinceCodename');

  // const provinceOptions = getProvinceList().map(p => ({
  //   name: p.name,
  //   value: p.codename,
  // }));
  // const cityOptions = useMemo(
  //   () =>
  //     getCityList(provinceCodenameWatcher)?.map(c => ({
  //       name: c.name,
  //       value: c.codename,
  //     })),
  //   [provinceCodenameWatcher],
  // );

  const onSubmitHandler = async (values: EditTenantFormValues) => {
    setSubmitting(true);
    await onSubmit?.(values);
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
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6">Người quản lý</Typography>
      </Box>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField fullWidth label="email" disabled {...field} />
        )}
      />

      <Box sx={{ width: '100%' }}>
        <Typography variant="h6">Thông tin trường</Typography>
      </Box>

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
          inputProps={{
            label: 'Logo trường',
            disabled: !editable,
            sx: { margin: 0 },
          }}
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
          inputProps={{
            label: 'Hình nền 1',
            disabled: !editable,
            sx: { margin: 0 },
          }}
        />

        <UploadBackgroundInput
          control={control}
          name="background2"
          inputProps={{
            label: 'Hình nền 2',
            disabled: !editable,
            sx: { margin: 0 },
          }}
        />

        <UploadBackgroundInput
          control={control}
          name="background3"
          inputProps={{
            label: 'Hình nền 3',
            disabled: !editable,
            sx: { margin: 0 },
          }}
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
              disabled={!editable}
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
          name="tenantId"
          render={({ field }) => (
            <TextField fullWidth label="Tenant Id" disabled {...field} />
          )}
        />
      </Box>

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            fullWidth
            disabled={!editable}
            label="Tên trường"
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="provinceName"
        render={({ field }) => (
          <TextField
            fullWidth
            disabled={!editable}
            label="Tỉnh/Thành phố"
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="cityName"
        render={({ field }) => (
          <TextField
            fullWidth
            disabled={!editable}
            label="Quận/Huyện"
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <TextField
            fullWidth
            disabled={!editable}
            label="Địa chỉ"
            {...field}
          />
        )}
      />

      {/* <SelectInput
        control={control}
        name="provinceCodename"
        options={provinceOptions}
        inputProps={{
          label: 'Tỉnh',
          sx: {
            width: '100%',
          },
        }}
      />

      <SelectInput
        control={control}
        name="cityCodename"
        options={cityOptions}
        inputProps={{
          label: 'Thành phố',
          sx: {
            width: '100%',
          },
        }}
      /> */}

      <Controller
        name="theme"
        control={control}
        render={({ field }) => (
          <TextField
            fullWidth
            disabled={!editable}
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

      {editable ? (
        <RichTextInput
          control={control}
          name="description"
          inputProps={{
            // disabled: !editable,
            placeholder: 'Hãy mô tả thêm về trường',
            containerSx: {
              width: '100%',
            },
          }}
        />
      ) : (
        <>
          <Box sx={{ width: '100%' }}>
            <Typography fontWeight={600}>Mô tả</Typography>
          </Box>
          <EditorPreview
            value={initialData.description || ''}
            sx={{ color: theme.palette.text.disabled }}
          />
        </>
      )}

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
        {onSubmit ? (
          <Button
            variant="contained"
            disabled={submitting}
            onClick={handleSubmit(onSubmitHandler)}
          >
            Lưu
          </Button>
        ) : null}
      </Box>
    </Paper>
  );
};

export default EditTenantForm;
