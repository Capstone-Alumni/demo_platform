/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { Alert, Stack, TextField } from '@mui/material';
// hooks
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

type InitialValues = {
  email: string;
  afterSubmit?: string;
};

type ResetPasswordFormProps = {
  onSent: VoidFunction;
  onGetEmail: (value: string) => void;
};

export default function ResetPasswordForm({
  onSent,
  onGetEmail,
}: ResetPasswordFormProps) {
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      email: 'demo@minimals.cc',
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      // try {
      //   resetPassword?.(values.email);
      //   if (isMountedRef.current) {
      //     onSent();
      //     onGetEmail(formik.values.email);
      //     setSubmitting(false);
      //   }
      // } catch (error) {
      //   console.error(error);
      //   if (isMountedRef.current) {
      //     setErrors({ afterSubmit: error.message });
      //     setSubmitting(false);
      //   }
      // }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit}</Alert>
          )}

          <TextField
            fullWidth
            {...getFieldProps('email')}
            type="email"
            label="Email address"
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <Button fullWidth size="large" type="submit" variant="contained">
            Reset Password
          </Button>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
