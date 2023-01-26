'use client';

import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import useRegisterTenant from '../hooks/useRegisterTenant';
import RegisterTenantForm, {
  RegisterTenantFormValues,
} from './RegisterTenantForm';

const RegisterTenantPage = () => {
  const router = useRouter();

  const { registerTenant } = useRegisterTenant();

  const onAddTenant = async (values: RegisterTenantFormValues) => {
    await registerTenant(values);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <RegisterTenantForm
        onSubmit={onAddTenant}
        onClose={() => router.push('/')}
      />
    </Box>
  );
};

export default RegisterTenantPage;
