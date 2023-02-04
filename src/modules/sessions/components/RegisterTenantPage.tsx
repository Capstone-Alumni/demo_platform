'use client';

import { Box } from '@mui/material';
import useRegisterTenant from '../hooks/useRegisterTenant';
import RegisterTenantForm, {
  RegisterTenantFormValues,
} from './RegisterTenantForm';

const RegisterTenantPage = () => {
  const { registerTenant } = useRegisterTenant();

  const onAddTenant = async (values: RegisterTenantFormValues) => {
    await registerTenant(values);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <RegisterTenantForm onSubmit={onAddTenant} />
    </Box>
  );
};

export default RegisterTenantPage;
