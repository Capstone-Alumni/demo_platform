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
      redirect: false,
    }).then(res => {
      console.log(res);
      if (res?.error) {
        toast.error('Đăng nhap thất bại');
      } else {
        router.replace('/');
      }
    });
  };

  return {
    login,
  };
};

export default useLogin;
