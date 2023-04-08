import { LoginFormValues } from './../components/LoginForm';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';

const useLogin = () => {
  const router = useRouter();

  const login = async (values: LoginFormValues) => {
    await signIn('credentials', {
      email: values?.email,
      password: values?.password,
      redirect: false,
    }).then(res => {
      if (res?.error) {
        toast.error('Đăng nhập thất bại');
      } else {
        toast.success('Đăng nhập thành công');
        router.push('/dashboard');
      }
    });
  };

  return {
    login,
  };
};

export default useLogin;
