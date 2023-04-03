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
import UploadAvatarInput from '@share/components/form/UploadAvatarInput';
import RichTextInput from '@share/components/form/RichTextInput';
import UploadBackgroundInput from '@share/components/form/UploadBackgroundInput';
import useActivateTenantById from '../hooks/useActivateTenant';
import useApproveTenantById from '../hooks/useApproveTenant';
import { formatDate } from '@share/utils/formatDate';
import getSubscriptionDisplay from '@share/utils/getSubscriptionDisplay';

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
});

const SubscriptionForm = ({ initialData: data }: { initialData: Tenant }) => {
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);

  const { approveTenantById } = useApproveTenantById();

  const onSubmitHandler = async () => {
    setSubmitting(true);
    await approveTenantById({ id: data.id });
    setSubmitting(false);
    // window.location.reload();
  };

  return (
    <Paper
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: data.approved ? 'column' : 'row',
        gap: theme.spacing(2),
        padding: theme.spacing(2),
        border: 1,
        borderColor: theme.palette.divider,
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">Gói đăng ký</Typography>
        <Typography>{getSubscriptionDisplay(data.plan?.name)}</Typography>
      </Box>

      {data.approved ? (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6">Ngày hết hạn</Typography>
          <Typography>
            {data.subcriptionEndTime
              ? formatDate(new Date(data.subcriptionEndTime))
              : 'Chưa thanh toán'}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Button
            variant="contained"
            disabled={submitting}
            onClick={onSubmitHandler}
          >
            Chấp nhận
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default SubscriptionForm;
