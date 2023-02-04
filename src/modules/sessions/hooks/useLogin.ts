import { LoginFormValues } from './../components/LoginForm';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';

const useLogin = () => {
  const router = useRouter();

  const login = (values: LoginFormValues) => {
    signIn('credentials', {
      email: values?.email,
      password: values?.password,
    }).then(res => {
      if (res?.error) {
        toast.error('Đăng nhập thất bại');
      } else {
        router.push('/');
      }
    });
  };

  return {
    login,
  };
};

export default useLogin;
