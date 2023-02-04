'use client';

import { Box } from '@mui/material';
import useLogin from '../hooks/useLogin';
import LoginForm, { LoginFormValues } from './LoginForm';

const LoginPage = () => {
  const { login } = useLogin();

  const onLogin = async (values: LoginFormValues) => {
    await login(values);
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
      <LoginForm onSubmit={onLogin} />
    </Box>
  );
};

export default LoginPage;
