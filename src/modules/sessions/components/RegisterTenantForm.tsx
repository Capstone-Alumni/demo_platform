'use client';

import uniqid from 'uniqid';

import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import * as yup from 'yup';

import {
  alpha,
  Box,
  Button,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import useYupValidateionResolver from 'src/modules/share/utils/useYupValidationResolver';
import {
  requiredEmailValidator,
  requiredFullNameValidator,
  requiredPasswordValidator,
} from '@share/utils/validators';
import Logo from '@share/components/Logo';
import UploadAvatarInput from '@share/components/form/UploadAvatarInput';
import { getCityList, getProvinceList } from '@share/utils/getLocaltionList';
import SelectInput from '@share/components/form/SelectInput';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { noop } from 'lodash';
import { setStorage } from '@lib/firebase/methods/setStorage';
import { Link } from '@mui/material';

const TEMPLATE_FILE =
  'https://firebasestorage.googleapis.com/v0/b/alumni-pf.appspot.com/o/QDDK.docx?alt=media&token=7ad981a8-352d-4946-ab0e-7d6bc07a3d7b';

const StyledPlanBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  flex: 1,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  borderWidth: '1px',
  borderColor: theme.palette.divider,
  borderStyle: 'solid',
  '&:hover': {
    borderWidth: '2px',
    borderColor: theme.palette.primary.light,
    background: alpha(theme.palette.primary.lighter, 0.15),
  },
}));

export type RegisterTenantFormValues = {
  fullName: string;
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
  evidenceUrl: string;
};

const validationSchema = yup.object({
  fullName: requiredFullNameValidator,
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
      fullName: '',
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
  const evidenceUrlWatcher = watch('evidenceUrl');

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

  const onUploadFile = async (file?: File) => {
    if (!file) {
      return;
    }
    setValue('evidenceUrl', file);
  };

  const onSubmitHandler = async (values: RegisterTenantFormValues) => {
    if (!values.evidenceUrl) {
      toast.error(
        'Thiếu văn bản thể hiện sự đồng ý cho phép từ phía nhà trường',
      );
      return null;
    }

    setSubmitting(true);
    const provinceData = provinceOptions.find(
      p => p.value === values.provinceCodename,
    );
    const cityData = cityOptions.find(c => c.value === values.cityCodename);

    const { uploadAvatar } = setStorage();
    const url = await uploadAvatar(uniqid(), values.evidenceUrl);

    console.log(values);

    await onSubmit({
      ...values,
      provinceName: provinceData?.name,
      cityName: cityData?.name,
      evidenceUrl: url,
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
          {planWatcher === '6-month' ? '6 tháng' : null}
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
          name="fullName"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              label="Họ và tên"
              {...field}
              error={Boolean(error?.message)}
              helperText={error?.message}
            />
          )}
        />

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
            label: 'Tỉnh/Thành phố',
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
            label: 'Huyện/Quận',
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

        <Box sx={{ width: '100%' }}>
          <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
            Văn bản thể hiện sự đồng ý cho phép từ phía nhà trường
          </Typography>

          <Stack direction="row" gap={1} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Button variant="outlined" onClick={noop}>
                Chọn file
              </Button>
              <input
                type="file"
                accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={e => onUploadFile(e.target.files?.[0])}
                style={{
                  width: '100px',
                  height: '30px',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  opacity: 0,
                }}
              />
              {evidenceUrlWatcher ? (
                <Typography color="primary">
                  {evidenceUrlWatcher.name}
                </Typography>
              ) : null}
            </Box>
            <Link href={TEMPLATE_FILE} target="_blank">
              Tải file mẫu
            </Link>
          </Stack>

          <Typography variant="body2" color="GrayText" sx={{ mt: 1 }}>
            Sau khi tiếp nhận hồ sơ đăng ký. Nền tảng sẽ liên hệ với nhà trường
            để xác nhận các nội dung có liên quan.
            <Typography variant="body2" fontWeight={600}>
              chỉ chấp nhận file *.doc, *.docx hoặc *.pdf
            </Typography>
          </Typography>
        </Box>

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
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Chọn gói
      </Typography>
      <Stack direction={{ md: 'row', sm: 'column' }} gap={2}>
        <StyledPlanBox>
          <Typography variant="h6">Gói 3 tháng</Typography>
          <Typography mb={2}>3,000,000 VNĐ</Typography>
          <Image src="/basic-plan.svg" alt="basic" width={262} height={250} />
          <Button
            fullWidth
            variant="contained"
            onClick={() => setValue('plan', '3-month')}
          >
            Chọn
          </Button>
        </StyledPlanBox>
        <StyledPlanBox>
          <Typography variant="h6">Gói 6 tháng</Typography>
          <Typography mb={2}>5,000,000 VNĐ</Typography>
          <Image src="/advance-plan.svg" alt="basic" width={250} height={250} />
          <Button
            fullWidth
            variant="contained"
            onClick={() => setValue('plan', '6-month')}
          >
            Chọn
          </Button>
        </StyledPlanBox>
        <StyledPlanBox>
          <Typography variant="h6">Gói 1 năm</Typography>
          <Typography mb={2}>8,000,000 VNĐ</Typography>
          <Image src="/pro-plan.svg" alt="basic" width={250} height={250} />
          <Button
            fullWidth
            variant="contained"
            onClick={() => setValue('plan', '1-year')}
          >
            Chọn
          </Button>
        </StyledPlanBox>
      </Stack>
    </Box>
  );
};

export default RegisterTenantForm;
