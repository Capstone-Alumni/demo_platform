'use client';

import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import useLogin from '../hooks/useLogin';
import LoginForm, { LoginFormValues } from './LoginForm';

const LoginPage = () => {
  const router = useRouter();

  const { login } = useLogin();

  const onLogin = async (values: LoginFormValues) => {
    await login(values);
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
      <LoginForm onSubmit={onLogin} onClose={() => router.push('/')} />
    </Box>
  );
};

export default LoginPage;
