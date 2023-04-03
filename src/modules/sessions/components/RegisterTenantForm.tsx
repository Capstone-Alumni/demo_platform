'use client';

import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import * as yup from 'yup';

import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import useYupValidateionResolver from 'src/modules/share/utils/useYupValidationResolver';
import {
  requiredEmailValidator,
  requiredPasswordValidator,
} from '@share/utils/validators';
import Logo from '@share/components/Logo';
import UploadAvatarInput from '@share/components/form/UploadAvatarInput';
import { getCityList, getProvinceList } from '@share/utils/getLocaltionList';
import SelectInput from '@share/components/form/SelectInput';

export type RegisterTenantFormValues = {
  email: string;
  password: string;
  logo: string;
  name: string;
  provinceCodename: string;
  provinceName?: string;
  cityCodename: string;
  cityName?: string;
  address: string;
  plan: string;
  subdomain: string;
};

const validationSchema = yup.object({
  email: requiredEmailValidator,
  password: requiredPasswordValidator,
  name: yup.string().required('Bắt buộc'),
  logo: yup.string(),
  provinceCodename: yup.string().required('Bắt buộc'),
  cityCodename: yup.string().required('Bắt buộc'),
  address: yup.string().required('Bắt buộc'),
  plan: yup.string().required('Bẳt buộc'),
  subdomain: yup.string().required('Bẳt buộc'),
});

const MAINAPP_DOMAIN = '.vercel.app';

const RegisterTenantForm = ({
  onSubmit,
}: {
  onSubmit: (values: RegisterTenantFormValues) => Promise<void>;
}) => {
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);

  const resolver = useYupValidateionResolver(validationSchema);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      logo: '',
      address: '',
      subdomain: '',
    },
    resolver,
  });

  const planWatcher = watch('plan');
  const provinceCodenameWatcher = watch('provinceCodename');

  const provinceOptions = getProvinceList().map(p => ({
    name: p.name,
    value: p.codename,
  }));
  const cityOptions = useMemo(
    () =>
      getCityList(provinceCodenameWatcher)?.map(c => ({
        name: c.name,
        value: c.codename,
      })),
    [provinceCodenameWatcher],
  );

  const onSubmitHandler = async (values: RegisterTenantFormValues) => {
    setSubmitting(true);
    const provinceData = provinceOptions.find(
      p => p.value === values.provinceCodename,
    );
    const cityData = cityOptions.find(c => c.value === values.cityCodename);
    await onSubmit({
      ...values,
      provinceName: provinceData?.name,
      cityName: cityData?.name,
    });
    setSubmitting(false);
  };

  return planWatcher ? (
    <Stack direction="column" gap={2}>
      <Typography variant="h6">
        Gói đã chọn{' '}
        <Typography
          component="span"
          color="primary"
          variant="h6"
          fontWeight="bold"
        >
          {planWatcher === '3-month' ? '3 tháng' : null}
          {planWatcher === '6-month' ? '3 tháng' : null}
          {planWatcher === '1-year' ? '1 năm' : null}
        </Typography>
      </Typography>

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

        <SelectInput
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
        />

        <Controller
          control={control}
          name="address"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              label="Địa chỉ"
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
    </Stack>
  ) : (
    <Box>
      <Typography>Chọn gói</Typography>
      <Stack direction={{ md: 'row', sm: 'column' }}>
        <Box>
          Gói 3 tháng:{' '}
          <Button onClick={() => setValue('plan', '3-month')}>Select</Button>
        </Box>
        <Box>
          Gói 6 tháng:{' '}
          <Button onClick={() => setValue('plan', '6-month')}>Select</Button>
        </Box>
        <Box>
          Gói 1 năm:{' '}
          <Button onClick={() => setValue('plan', '1-year')}>Select</Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default RegisterTenantForm;
